interface CopiedNoticeProps {
  copiedCount: number;
  isVisible: boolean;
  message: string;
}

export const CopiedNotice = ({ copiedCount, isVisible, message }: CopiedNoticeProps) => (
  <div className={isVisible ? 'copied-notice is-visible' : 'copied-notice'} role="status">
    {copiedCount > 0 && <span key={copiedCount}>{message}</span>}
  </div>
);
