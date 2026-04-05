type Props = { className?: string };

export default function Skeleton({ className = "" }: Props) {
  return <div className={"animate-shimmer rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] " + className} />;
}
