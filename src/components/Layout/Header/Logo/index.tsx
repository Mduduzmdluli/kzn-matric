import { getImagePrefix } from "@/utils/util";
import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <Image
        src= {`${getImagePrefix()}/images/logo/logo.png`}
        alt="KwaZulu Natal Matric Excellence"
        width={200}
        height={53}
        style={{ width: "auto", height: "53px" }}
        quality={100}
      />
    </Link>
  );
};

export default Logo;
