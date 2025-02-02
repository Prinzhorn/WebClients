import { c } from 'ttag';
import { MouseEventHandler } from 'react';
import { Icon, classnames, Tooltip } from '@proton/components';
import { Recipient } from '@proton/shared/lib/interfaces';
import { getAppName } from '@proton/shared/lib/apps/helper';
import { APPS } from '@proton/shared/lib/constants';
import { isProtonAddress } from './helpers';

interface Props {
    recipient: Recipient;
    onDeleteRecipient: MouseEventHandler;
    isValid: boolean;
}

const getErrorMessage = (emailAddress: string) => {
    const appName = getAppName(APPS.PROTONMAIL);
    if (isProtonAddress(emailAddress)) {
        return c('Info').t`You cannot refer ${appName} users`;
    }
    return c('Info').t`${emailAddress} is invalid`;
};

const InviteSendEmailRecipient = ({ recipient, onDeleteRecipient, isValid }: Props) => {
    const emailAddress = recipient.Address;

    return (
        <Tooltip title={!isValid ? getErrorMessage(emailAddress) : undefined}>
            <div
                className={classnames([
                    'm0-25 p0-25 flex flex-nowrap',
                    isValid ? 'bg-weak' : 'bg-danger text-white opacity-65',
                ])}
                key={recipient.Address}
            >
                <span className="text-no-wrap pr0-5 text-ellipsis">{recipient.Address}</span>
                <span className="cursor-pointer" onClick={onDeleteRecipient}>
                    <Icon name="xmark" />
                </span>
            </div>
        </Tooltip>
    );
};

export default InviteSendEmailRecipient;
