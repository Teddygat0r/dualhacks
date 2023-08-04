import Image from "next/image";
export default function DemoImage() {
  return (
    <>
      <Image
        height="200"
        width="200"
        alt="no demo image joever"
        src="/demoimage.jpg"
      ></Image>
    </>
  );
}
