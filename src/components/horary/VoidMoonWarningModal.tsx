import ConfirmationModal from "../reusable/ConfirmationModal";

interface VoidMoonWarningModalProps {
  isOpen: boolean;
  moonSign?: string;
  onProceed: () => void;
  onCancel: () => void;
}

export default function VoidMoonWarningModal({ 
  isOpen, 
  moonSign, 
  onProceed, 
  onCancel 
}: VoidMoonWarningModalProps) {
  const message = `The Moon is currently void of course${moonSign ? ` in ${moonSign}` : ''}. Traditional horary astrology teaches that "nothing will come of the matter" when the Moon is void. This means your question may not receive a reliable answer or may indicate that the situation will not develop as expected. Do you still wish to proceed?`;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      title="Void Moon Warning"
      message={message}
      confirmText="Cast Chart Anyway"
      cancelText="Wait for Better Time"
      onConfirm={onProceed}
      onCancel={onCancel}
      autoClose={30} // Auto-cancel after 30 seconds
    />
  );
}