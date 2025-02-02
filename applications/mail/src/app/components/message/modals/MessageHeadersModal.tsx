import { Message } from '@proton/shared/lib/interfaces/mail/Message';
import {
    Button,
    Form,
    ModalProps,
    ModalTwo,
    ModalTwoContent,
    ModalTwoFooter,
    ModalTwoHeader,
} from '@proton/components';
import { c } from 'ttag';
import downloadFile from '@proton/shared/lib/helpers/downloadFile';

interface Props extends ModalProps {
    message?: Message;
}

const MessageHeadersModal = ({ message, ...rest }: Props) => {
    const { onClose } = rest;
    const content = `${message?.Header}\n\r${message?.Body}`;

    const handleDownload = () => {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        downloadFile(blob, 'pgp.txt');
    };

    return (
        <ModalTwo size="large" as={Form} onSubmit={handleDownload} {...rest}>
            <ModalTwoHeader title={c('Info').t`Message headers`} />
            <ModalTwoContent>
                <pre className="text-break">{content}</pre>
            </ModalTwoContent>
            <ModalTwoFooter>
                <Button onClick={onClose}>{c('Action').t`Cancel`}</Button>
                <Button color="norm" type="submit">{c('Action').t`Download`}</Button>
            </ModalTwoFooter>
        </ModalTwo>
    );
};

export default MessageHeadersModal;
