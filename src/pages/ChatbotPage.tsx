import { PageHeader } from '../components/common/PageHeader';
import { ChatWindow } from '../components/chatbot/ChatWindow';
import { useTranslation } from '../context/LanguageContext';

export default function ChatbotPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        title={t('chatbot.title')}
        description={t('chatbot.desc')}
      />
      <ChatWindow />
    </>
  );
}
