import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { FEEDBACK_LANGUAGES } from "../i18n/languages.js";
import { FEEDBACK_CATEGORIES } from "../constants/categories.js";
import { useLanguage } from "../i18n/LanguageContext.jsx";
import { ChatIcon, GlobeIcon, SparkleIcon, ListIcon, ImageIcon, UploadIcon, XCircleIcon } from "../components/Icons.jsx";

const DEFAULT_PRODUCTS = ["Amazon", "Flipkart", "Swiggy", "Zomato", "PhonePe", "Netflix", "Ola", "Uber"];
const OTHERS = "Others";

export default function Feedback() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [platformId, setPlatformId] = useState("");
  const [customPlatform, setCustomPlatform] = useState("");
  const [productName, setProductName] = useState("");
  const [language, setLanguage] = useState("English");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    api.get("/products").then((res) => {
      setProducts(res.data);
      if (res.data.length) setPlatformId(res.data[0].id);
    }).catch(() => {
      // fallback to default products if API fails
    });
  }, []);

  const platformList = products.length ? products : DEFAULT_PRODUCTS.map((n, i) => ({ id: i + 1, name: n }));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const finalCategory = category === "Other" ? customCategory.trim() : category;
    if (!finalCategory) {
      setError("Please select a feedback category before submitting.");
      return;
    }
    if (platformId === OTHERS && !customPlatform.trim()) {
      setError("Please enter the platform name.");
      return;
    }
    if (!platformId) {
      setError("Please select a platform.");
      return;
    }
    if (!text.trim()) {
      setError("Please enter your feedback text.");
      return;
    }

    setLoading(true);
    try {
      let pid = platformId;
      if (platformId === OTHERS) {
        const { data } = await api.post("/products", { name: customPlatform.trim() });
        pid = data.id;
      }

      const formData = new FormData();
      formData.append("product_id", String(Number(pid)));
      formData.append("language", language);
      formData.append("text", text.trim());
      formData.append("category", finalCategory);
      if (productName.trim()) formData.append("product_name", productName.trim());
      if (image) formData.append("image", image);

      const { data } = await api.post("/feedback", formData);
      navigate(`/feedback/${data.id}`);
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg || String(d)).join(", "));
      } else if (typeof detail === "string") {
        setError(detail);
      } else if (err.response?.status === 401) {
        setError("Please login first to submit feedback.");
      } else if (err.response?.status === 422) {
        setError("Invalid form data. Please check all fields and try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-5 lg:px-8 py-8 sm:py-12 animate-fadeUp">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal to-blue text-white flex items-center justify-center shadow-soft shrink-0">
          <ChatIcon width={20} height={20} />
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold text-ink">{t("feedbackTitle")}</h1>
      </div>
      <p className="text-gray-500 mb-7 sm:ml-14 text-sm sm:text-base">{t("feedbackSubtitle")}</p>

      <form onSubmit={submit} className="card space-y-5">
        <div>
          <label className="text-sm font-semibold text-teal mb-1.5 block">{t("formSelectProduct")}</label>
          <select className="input" value={platformId} onChange={(e) => setPlatformId(e.target.value)}>
            {platformList.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
            <option value={OTHERS}>{t("formOthers")}</option>
          </select>
          {platformId === OTHERS && (
            <input
              className="input mt-2"
              placeholder={t("formCustomProduct")}
              value={customPlatform}
              onChange={(e) => setCustomPlatform(e.target.value)}
              required
            />
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-teal mb-1.5 block">{t("formProductName")}</label>
          <input
            className="input"
            placeholder={t("formProductNamePlaceholder")}
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-teal mb-1.5 flex items-center gap-1.5">
            <ListIcon width={15} height={15} />
            Feedback Category <span className="text-coral">*</span>
          </label>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="" disabled>Select a category</option>
            {FEEDBACK_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {category === "Other" && (
            <input
              className="input mt-2"
              placeholder="Describe the category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              required
            />
          )}
        </div>

        <div>
          <label className="text-sm font-semibold text-teal mb-1.5 flex items-center gap-1.5">
            <GlobeIcon width={15} height={15} />
            {t("formChooseLanguage")}
          </label>
          <select className="input" value={language} onChange={(e) => setLanguage(e.target.value)}>
            {FEEDBACK_LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-teal mb-1.5 block">{t("formEnterFeedback")}</label>
          <textarea
            className="input"
            rows={5}
            placeholder={t("formFeedbackPlaceholder")}
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-teal mb-1.5 flex items-center gap-1.5">
            <ImageIcon width={15} height={15} />
            {t("formUploadProof")}
          </label>
          {!imagePreview ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-blue-soft rounded-xl py-6 flex flex-col items-center gap-1.5 text-gray-400 hover:border-teal hover:text-teal transition-colors"
            >
              <UploadIcon width={22} height={22} />
              <span className="text-sm font-medium">Tap to upload a photo</span>
              <span className="text-xs">{t("formUploadProofHint")}</span>
            </button>
          ) : (
            <div className="relative w-full sm:w-56">
              <img src={imagePreview} alt="Proof preview" className="w-full h-40 object-cover rounded-xl shadow-soft" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-2.5 -right-2.5 bg-white rounded-full shadow-soft text-coral"
                aria-label="Remove photo"
              >
                <XCircleIcon width={22} height={22} />
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {error && <p className="text-coral text-sm font-medium">{error}</p>}
        <button type="submit" className="btn-primary w-full justify-center text-base" disabled={loading}>
          {loading ? (
            <>
              <SparkleIcon width={18} height={18} className="animate-pulseSoft" />
              {t("btnAnalyzeFeedback")}
            </>
          ) : (
            t("btnSubmitFeedback")
          )}
        </button>
      </form>
    </div>
  );
}