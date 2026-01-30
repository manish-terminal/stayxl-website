import DateRangePicker from '../components/DateRangePicker';

export default function DatePickerDemo() {
  return (
    <div className="min-h-screen bg-[#EFE7E7] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[#072720] mb-4">
            Date Range Picker Demo
          </h1>
          <p className="text-lg text-[#072720]/70">
            Premium StayVista-style calendar component
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-serif text-[#072720] mb-6">
            Select Your Stay Dates
          </h2>
          
          <DateRangePicker
            onDateChange={(dates) => {
              console.log('Selected dates:', dates);
            }}
          />

          <div className="mt-8 p-4 bg-[#EFE7E7] rounded-lg">
            <h3 className="text-sm font-semibold text-[#072720] mb-2">
              Features:
            </h3>
            <ul className="text-sm text-[#072720]/70 space-y-1">
              <li>✓ Dual-month view (desktop)</li>
              <li>✓ Single-month view (mobile)</li>
              <li>✓ Date range selection with hover preview</li>
              <li>✓ Past dates disabled</li>
              <li>✓ Formatted date display: "31 Jan Sat 2026"</li>
              <li>✓ Click outside to close</li>
              <li>✓ Smooth animations</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-[#072720] text-white rounded-full hover:bg-[#072720]/90 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
