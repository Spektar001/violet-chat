import Image from "next/image";

type Props = {
  size?: number;
};

const LoadingLogo = ({ size = 100 }: Props) => {
  return (
    <div className="w-3/4 h-full flex items-center justify-center bg-chat-tile-light dark:bg-chat-tile-dark">
      <Image
        src={"/logo.svg"}
        width={size}
        height={size}
        alt={"logo"}
        className="animate-pulse duration-800"
      />
    </div>
  );
};

export default LoadingLogo;
