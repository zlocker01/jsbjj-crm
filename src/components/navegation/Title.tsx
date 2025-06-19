interface TitleProps {
  text: string;
}

export const Title: React.FC<TitleProps> = ({ text }) => {
  return <h1 className="text-primaryColor font-bold my-2 text-2xl">{text}</h1>;
};
