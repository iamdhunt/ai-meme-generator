import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faPatreon,
  faYoutube,
  faTiktok,
  faTwitch,
  faFacebookSquare,
  faRedditAlien,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Link
        href="https://livinglifefearless.co"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="/logos/Brand-Logo-Wave-White-Retina.png"
          alt="Powered By Logo"
          width={110}
          height={51}
        />
      </Link>
      <div className="flex flex-row gap-3 mt-10 text-[20px]">
        <Link
          href="https://instagram.com/livinglifefearless"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-hover"
        >
          <FontAwesomeIcon icon={faInstagram} title="Instagram" />
        </Link>
        <Link
          href="https://tiktok.com/@llfofficial"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-hover"
        >
          <FontAwesomeIcon icon={faTiktok} title="TikTok" />
        </Link>
        <Link
          href="https://youtube.com/c/livinglifefearless"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-hover"
        >
          <FontAwesomeIcon icon={faYoutube} title="YouTube" />
        </Link>
        <Link
          href="https://twitch.com/livinglifefearless"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-hover"
        >
          <FontAwesomeIcon icon={faTwitch} title="Twitch" />
        </Link>
        <Link
          href="https://facebook.com/livinglifefearless"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-hover"
        >
          <FontAwesomeIcon icon={faFacebookSquare} title="Facebook" />
        </Link>
        <Link
          href="https://reddit.com/r/livinglifefearless/"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-hover"
        >
          <FontAwesomeIcon icon={faRedditAlien} title="Reddit" />
        </Link>
        <Link
          href="https://patreon.com/livinglifefearless"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-hover"
        >
          <FontAwesomeIcon icon={faPatreon} title="Patreon" />
        </Link>
      </div>
      <div className="text-sm mt-5 text-gray-300">© COPYRIGHT 2025 LLF</div>
    </div>
  );
}
