import styles from "./VideoEmbed.module.css";

type VideoData = {
  youTubeUrl?: string;
  caption?: string;
  title?: string;
};

type Props = {
  id: string;
  data: { video: VideoData };
};

const VideoEmbed = ({ data }: Props) => {
  const src = data.video?.youTubeUrl;
  const caption = data.video?.caption;
  const title = data.video?.title;

  return (
    <div className={styles.wrapper}>
      <div className={styles.videoInner}>
        <iframe
          referrerPolicy="strict-origin-when-cross-origin"
          className={styles.videoIframe}
          src={src}
          title={title || "Video"}
          allowFullScreen
        />
      </div>
      {caption && <div className={styles.videoCaption}>{caption}</div>}
    </div>
  );
};

export default VideoEmbed;
