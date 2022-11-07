interface IProps {
  id: number;
  classname?: string;
  name: string;
  onClick: () => void;
  text: string;
}

export default function Button({
  id,
  classname = "",
  name,
  onClick = () => {},
  text,
}: IProps) {
  return (
    <button
      className={`flex bg-slate-700 items-center justify-center rounded-sm text-white hover:bg-slate-600`}
      name={name}
      onClick={onClick}
    >
      {text}
    </button>
  )
}