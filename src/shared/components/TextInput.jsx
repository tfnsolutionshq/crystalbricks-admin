export function TextInput(props) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-300 ${
        props.className || ""
      }`}
    />
  );
}
