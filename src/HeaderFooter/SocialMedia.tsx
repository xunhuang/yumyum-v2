import { useLocation } from 'react-router-dom';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

const QUOTE =
  "Best real-time county-level COVID-19 dashboard. Get the latest trends about cases, recovery, testing and hospitalization as well as resources for mental health and well-being.";

type SocialMediaProps = {
  buttonClassName: string;
  className: string;
  iconColor?: string;
  url?: string;
};

export const SocialMediaButtons = (props: SocialMediaProps) => {
  const location = useLocation();

  let url = props.url
    ? props.url
    : "https://covid-19.direct" + location.pathname;

  return (
    <div className={props.className}>
      {[
        [FacebookShareButton, FacebookIcon],
        [TwitterShareButton, TwitterIcon],
        [RedditShareButton, RedditIcon],
        [WhatsappShareButton, WhatsappIcon],
        [EmailShareButton, EmailIcon],
      ].map(([Button, Icon], i) => (
        <Button
          className={props.buttonClassName}
          url={url}
          quote={QUOTE}
          key={i}
        >
          <Icon
            size={"1em"}
            round={true}
            iconFillColor={props.iconColor}
            children={undefined}
            url={url}
          />
        </Button>
      ))}
    </div>
  );
};
