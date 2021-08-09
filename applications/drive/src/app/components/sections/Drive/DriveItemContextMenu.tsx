import { useEffect } from 'react';

import { ContextMenu, isPreviewAvailable } from '@proton/components';

import { LinkType } from '../../../interfaces/link';
import { ItemContextMenuProps } from '../../FileBrowser';
import { DetailsButton, DownloadButton, PreviewButton, RenameButton, SharingViaLinkButton } from '../ContextMenu';
import { MoveToFolderButton, MoveToTrashButton } from './ContextMenuButtons';
import { useDriveActiveFolder } from './DriveFolderProvider';

const DriveItemContextMenu = ({
    item,
    selectedItems,
    shareId,
    anchorRef,
    isOpen,
    position,
    open,
    close,
}: ItemContextMenuProps) => {
    const { folder: sourceFolder } = useDriveActiveFolder();

    const isOnlyOneItem = selectedItems.length === 1;
    const isOnlyOneFileItem = isOnlyOneItem && item.Type === LinkType.FILE;
    const hasPreviewAvailable = isOnlyOneFileItem && item.MIMEType && isPreviewAvailable(item.MIMEType);

    useEffect(() => {
        if (position) {
            open();
        }
    }, [position]);

    return (
        <ContextMenu isOpen={isOpen} close={close} position={position} anchorRef={anchorRef}>
            {hasPreviewAvailable && <PreviewButton shareId={shareId} item={item} close={close} />}
            <DownloadButton shareId={shareId} items={selectedItems} close={close} />
            {isOnlyOneItem && <RenameButton shareId={shareId} item={item} close={close} />}
            <DetailsButton shareId={shareId} items={selectedItems} close={close} />
            {sourceFolder && <MoveToFolderButton sourceFolder={sourceFolder} items={selectedItems} close={close} />}
            {isOnlyOneFileItem && <SharingViaLinkButton shareId={shareId} item={item} close={close} />}
            {sourceFolder && <MoveToTrashButton sourceFolder={sourceFolder} items={selectedItems} close={close} />}
        </ContextMenu>
    );
};

export default DriveItemContextMenu;