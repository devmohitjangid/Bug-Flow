import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bug,
  AlertTriangle,
  FileText,
  ListOrdered,
  Info,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

import Layout from "../components/Layout";
import { useBugs } from "../context/BugContext";
import { useRole } from "../context/RoleContext";

function ReportBug() {
  const navigate = useNavigate();
  const { addBug } = useBugs();
  const { currentUser } = useRole();

  const [formData, setFormData] = useState({
    title: "",
    severity: "Medium",
    description: "",
    steps: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const severityOptions = [
    {
      value: "Low",
      description: "Minor visual or usability issue",
    },
    {
      value: "Medium",
      description: "Affects normal functionality",
    },
    {
      value: "High",
      description: "Major feature is affected",
    },
    {
      value: "Critical",
      description: "Application or core workflow is blocked",
    },
  ];

  const severityStyles = {
    Low: "border-[#CBD7C6] bg-[#F1F5EF]",
    Medium: "border-[#DDD5A8] bg-[#F7F5E9]",
    High: "border-[#DFC7B0] bg-[#F8F0E8]",
    Critical: "border-[#DDBDB9] bg-[#F8ECEA]",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Issue title is required.";
    }

    if (formData.title.trim().length < 5) {
      newErrors.title = "Please enter a more descriptive title.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    if (!formData.steps.trim()) {
      newErrors.steps = "Steps to reproduce are required.";
    }

    if (!formData.severity) {
      newErrors.severity = "Severity is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newBug = addBug({ ...formData, reporter: currentUser.name });

    setSubmitted(true);

    setTimeout(() => {
      navigate(`/bugs/${newBug.id}`);
    }, 700);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      severity: "Medium",
      description: "",
      steps: "",
    });

    setErrors({});
  };

  return (
    <Layout>
      {/* Header */}
      <section className="mb-7">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#99948B]">
          Issue Management
        </p>

        <h1 className="text-2xl font-semibold tracking-tight text-[#22221F] sm:text-3xl">
          Report a Bug
        </h1>

        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#77736B]">
          Provide clear information about the issue so it can be
          reproduced, assigned and resolved efficiently.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#E2DED5] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        >
          {/* Form header */}
          <div className="border-b border-[#EBE7DF] px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEE8DD] text-[#393732]">
                <Bug size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-[#292925]">
                  Issue Information
                </h2>

                <p className="mt-0.5 text-xs text-[#8C877E]">
                  Fields marked with * are required
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-7 p-5 sm:p-7">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-[#45423D]"
              >
                Issue Title *
              </label>

              <div className="relative">
                <FileText
                  size={17}
                  className="absolute left-3.5 top-3.5 text-[#99948B]"
                />

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Login button does not respond"
                  className={`w-full rounded-xl border bg-[#FAF9F6] py-3 pl-10 pr-4 text-sm text-[#292925] outline-none transition placeholder:text-[#AAA59C] focus:bg-white focus:ring-2 focus:ring-[#DED8CC]/60 ${
                    errors.title
                      ? "border-[#B96B64]"
                      : "border-[#DDD8CE] focus:border-[#AAA399]"
                  }`}
                />
              </div>

              {errors.title && (
                <p className="mt-2 text-xs font-medium text-[#9A4D47]">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Severity */}
            <div>
              <div className="mb-3">
                <label className="block text-sm font-semibold text-[#45423D]">
                  Severity *
                </label>

                <p className="mt-1 text-xs text-[#99948B]">
                  Choose the impact this issue has on the application.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {severityOptions.map((option) => {
                  const selected =
                    formData.severity === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setFormData((current) => ({
                          ...current,
                          severity: option.value,
                        }))
                      }
                      className={`rounded-xl border p-4 text-left transition ${
                        selected
                          ? `${severityStyles[option.value]} ring-1 ring-[#AAA399]`
                          : "border-[#E2DED5] bg-white hover:bg-[#FAF9F6]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-[#3D3A35]">
                          {option.value}
                        </span>

                        <span
                          className={`h-3.5 w-3.5 rounded-full border ${
                            selected
                              ? "border-[#292925] bg-[#292925] ring-2 ring-white"
                              : "border-[#C7C1B7] bg-white"
                          }`}
                        />
                      </div>

                      <p className="mt-1.5 text-xs leading-5 text-[#817D75]">
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
              {errors.severity && (
                <p className="mt-2 text-xs font-medium text-[#9A4D47]">{errors.severity}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-[#45423D]"
              >
                Description *
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Explain what happened, what you expected to happen, and what actually happened..."
                className={`w-full resize-none rounded-xl border bg-[#FAF9F6] px-4 py-3 text-sm leading-6 text-[#292925] outline-none transition placeholder:text-[#AAA59C] focus:bg-white focus:ring-2 focus:ring-[#DED8CC]/60 ${
                  errors.description
                    ? "border-[#B96B64]"
                    : "border-[#DDD8CE] focus:border-[#AAA399]"
                }`}
              />

              <div className="mt-1.5 flex justify-between gap-3">
                <div>
                  {errors.description && (
                    <p className="text-xs font-medium text-[#9A4D47]">
                      {errors.description}
                    </p>
                  )}
                </div>

                <span className="text-[11px] text-[#AAA59C]">
                  {formData.description.length} characters
                </span>
              </div>
            </div>

            {/* Steps */}
            <div>
              <label
                htmlFor="steps"
                className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#45423D]"
              >
                Steps to Reproduce *
              </label>

              <div className="relative">
                <ListOrdered
                  size={17}
                  className="absolute left-3.5 top-3.5 text-[#99948B]"
                />

                <textarea
                  id="steps"
                  name="steps"
                  value={formData.steps}
                  onChange={handleChange}
                  rows="6"
                  placeholder={`1. Open the login page\n2. Enter valid credentials\n3. Click the Login button\n4. Observe the issue`}
                  className={`w-full resize-none rounded-xl border bg-[#FAF9F6] py-3 pl-10 pr-4 text-sm leading-6 text-[#292925] outline-none transition placeholder:text-[#AAA59C] focus:bg-white focus:ring-2 focus:ring-[#DED8CC]/60 ${
                    errors.steps
                      ? "border-[#B96B64]"
                      : "border-[#DDD8CE] focus:border-[#AAA399]"
                  }`}
                />
              </div>

              {errors.steps && (
                <p className="mt-2 text-xs font-medium text-[#9A4D47]">
                  {errors.steps}
                </p>
              )}
            </div>
          </div>

          {/* Bottom actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#EBE7DF] bg-[#FCFBF8] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCD7CE] bg-white px-4 py-2.5 text-sm font-medium text-[#5C5851] transition hover:bg-[#EEE8DD]"
            >
              <RotateCcw size={15} />
              Reset
            </button>

            <button
              type="submit"
              disabled={submitted}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#292925] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#3A3934] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitted ? (
                <>
                  <CheckCircle2 size={16} />
                  Issue Created
                </>
              ) : (
                <>
                  Create Issue
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* RIGHT PANEL */}
        <aside className="space-y-5">
          {/* Guidance */}
          <div className="rounded-2xl border border-[#E2DED5] bg-white p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEE8DD] text-[#514E47]">
              <Info size={19} />
            </div>

            <h2 className="mt-4 font-semibold text-[#292925]">
              Writing a good report
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#8C877E]">
              Clear bug reports help developers reproduce and resolve
              issues faster.
            </p>

            <div className="mt-5 space-y-4">
              {[
                "Use a short and descriptive issue title.",
                "Explain expected and actual behaviour.",
                "Provide reproducible steps in the correct order.",
                "Select severity based on actual impact.",
              ].map((tip, index) => (
                <div
                  key={tip}
                  className="flex items-start gap-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F0ECE4] text-[10px] font-bold text-[#625E57]">
                    {index + 1}
                  </span>

                  <p className="pt-0.5 text-xs leading-5 text-[#68645D]">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Lifecycle */}
          <div className="rounded-2xl bg-[#292925] p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#AAA69D]">
              After Submission
            </p>

            <h3 className="mt-3 text-lg font-semibold">
              Your issue starts as Open.
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#BEBAB1]">
              A manager can assign the issue to a developer before it
              moves through the resolution workflow.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="rounded-lg bg-white/10 px-2 py-1">
                Open
              </span>

              <span className="text-[#77736D]">→</span>

              <span className="rounded-lg bg-white/10 px-2 py-1">
                Assigned
              </span>

              <span className="text-[#77736D]">→</span>

              <span className="rounded-lg bg-white/10 px-2 py-1">
                In Progress
              </span>

              <span className="text-[#77736D]">→</span>

              <span className="rounded-lg bg-white/10 px-2 py-1">
                Fixed
              </span>

              <span className="text-[#77736D]">→</span>

              <span className="rounded-lg bg-white/10 px-2 py-1">
                Closed
              </span>
            </div>
          </div>

          {/* Severity help */}
          <div className="rounded-2xl border border-[#E2DED5] bg-[#F0ECE4] p-5">
            <div className="flex gap-3">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-[#625E57]"
              />

              <div>
                <p className="text-sm font-semibold text-[#45423D]">
                  Severity matters
                </p>

                <p className="mt-1 text-xs leading-5 text-[#77736B]">
                  Avoid marking every issue as Critical. It should be
                  reserved for problems that block an important
                  workflow.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  );
}

export default ReportBug;
