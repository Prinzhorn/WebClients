import { useEffect, useState } from 'react';
import { c } from 'ttag';

import { LABEL_COLORS, ROOT_FOLDER, LABEL_TYPE } from '@proton/shared/lib/constants';
import { randomIntFromInterval, noop } from '@proton/shared/lib/helpers/function';
import { create as createLabel, updateLabel, checkLabelAvailability } from '@proton/shared/lib/api/labels';
import { Folder } from '@proton/shared/lib/interfaces/Folder';
import { Label } from '@proton/shared/lib/interfaces/Label';
import { omit } from '@proton/shared/lib/helpers/object';

import {
    Button,
    ModalProps,
    ModalTwo,
    ModalTwoContent,
    ModalTwoFooter,
    ModalTwoHeader,
    useFormErrors,
} from '../../../components';
import { useEventManager, useLoading, useApi, useNotifications } from '../../../hooks';
import NewLabelForm from '../NewLabelForm';

export interface LabelModel extends Pick<Folder | Label, 'Name' | 'Color' | 'Type'> {
    ID?: string;
    ParentID?: string | number;
    Notify?: number;
    Expanded?: number;
    Order?: number;
    Path?: string;
}

interface Props extends ModalProps {
    type?: 'label' | 'folder';
    label?: LabelModel;
    mode?: 'create' | 'edition' | 'checkAvailable';
    onAdd?: (label: LabelModel) => void;
    onEdit?: (label: LabelModel) => void;
    onCheckAvailable?: (label: LabelModel) => void;
    onCloseCustomAction?: () => void;
}

const prepareLabel = (label: LabelModel) => {
    if (label.ParentID === ROOT_FOLDER) {
        return omit(label, ['ParentID']);
    }
    return label;
};

const EditLabelModal = ({
    label,
    mode = 'create',
    onAdd = noop,
    onEdit = noop,
    onCheckAvailable = noop,
    type = 'label',
    onCloseCustomAction,
    ...rest
}: Props) => {
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const api = useApi();
    const [loading, withLoading] = useLoading();
    const { validator, onFormSubmit } = useFormErrors();

    const { onClose } = rest;

    const [model, setModel] = useState<LabelModel>(
        label || {
            Name: '',
            Color: LABEL_COLORS[randomIntFromInterval(0, LABEL_COLORS.length - 1)],
            Type: type === 'folder' ? LABEL_TYPE.MESSAGE_FOLDER : LABEL_TYPE.MESSAGE_LABEL,
            ParentID: type === 'folder' ? ROOT_FOLDER : undefined,
            Notify: type === 'folder' ? 1 : 0,
        }
    );

    useEffect(() => {
        setModel(
            label || {
                Name: '',
                Color: LABEL_COLORS[randomIntFromInterval(0, LABEL_COLORS.length - 1)],
                Type: type === 'folder' ? LABEL_TYPE.MESSAGE_FOLDER : LABEL_TYPE.MESSAGE_LABEL,
                ParentID: type === 'folder' ? ROOT_FOLDER : undefined,
                Notify: type === 'folder' ? 1 : 0,
            }
        );
    }, [type]);

    const handleClose = () => {
        onCloseCustomAction?.();
        onClose?.();
    };

    const create = async (label: LabelModel) => {
        const { Label } = await api(createLabel(prepareLabel(label)));
        await call();
        createNotification({
            text: c('label/folder notification').t`${Label.Name} created`,
        });
        onAdd(Label);
        handleClose();
    };

    const update = async (label: LabelModel) => {
        if (label.ID) {
            const { Label } = await api(updateLabel(label.ID, prepareLabel(label)));
            await call();
            createNotification({
                text: c('Filter notification').t`${Label.Name} updated`,
            });
            onEdit(Label);
        }
        handleClose();
    };

    const checkIsAvailable = async (label: LabelModel) => {
        await api(checkLabelAvailability(label));
        onCheckAvailable(model);
        handleClose();
    };

    const handleSubmit = async () => {
        if (!onFormSubmit()) {
            return;
        }

        switch (mode) {
            case 'create':
                await withLoading(create(model));
                return;
            case 'edition':
                await withLoading(update(model));
                return;
            case 'checkAvailable':
                await withLoading(checkIsAvailable(model));
                return;
            default:
                return undefined;
        }
    };

    const handleChangeColor = (Color: string) => {
        setModel({
            ...model,
            Color,
        });
    };

    const handleChangeName = (value: string) => {
        setModel({
            ...model,
            Name: value,
        });
    };

    const handleChangeParentID = (ParentID: string | number) => {
        setModel({
            ...model,
            ParentID,
        });
    };

    const handleChangeNotify = (Notify: number) => {
        setModel({
            ...model,
            Notify,
        });
    };

    const getTitle = () => {
        const isFolder = model.Type === LABEL_TYPE.MESSAGE_FOLDER;
        if (mode === 'create') {
            return isFolder ? c('Label/folder modal').t`Create folder` : c('Label/folder modal').t`Create label`;
        }
        return isFolder ? c('Label/folder modal').t`Edit folder` : c('Label/folder modal').t`Edit label`;
    };

    return (
        <ModalTwo size="large" {...rest}>
            <ModalTwoHeader title={getTitle()} />
            <ModalTwoContent>
                <NewLabelForm
                    label={model}
                    onChangeName={handleChangeName}
                    onChangeColor={handleChangeColor}
                    onChangeParentID={handleChangeParentID}
                    onChangeNotify={handleChangeNotify}
                    validator={validator}
                />
            </ModalTwoContent>
            <ModalTwoFooter>
                <Button onClick={handleClose}>{c('Action').t`Cancel`}</Button>
                <Button color="norm" loading={loading} onClick={handleSubmit}>{c('Action').t`Save`}</Button>
            </ModalTwoFooter>
        </ModalTwo>
    );
};

export default EditLabelModal;
