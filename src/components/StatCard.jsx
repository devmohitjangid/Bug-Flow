function StatCard({
  title,
  value,
  icon: Icon,
  description,
  iconStyle = "bg-[#EEE8DD] text-[#35332E]",
}) {
  return (
    <div className="rounded-2xl border border-[#E2DED5] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(35,33,28,0.06)] sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#77736B]">{title}</p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-[#22221F]">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconStyle}`}
        >
          <Icon size={20} strokeWidth={2} />
        </div>
      </div>

      {description && (
        <p className="mt-4 text-xs text-[#99948B]">{description}</p>
      )}
    </div>
  );
}

export default StatCard;