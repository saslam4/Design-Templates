/**
 * Copyright (c) 2014 JaPy Szoftver Kft. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */
CKEDITOR.plugins.add( 'download', {
    icons: 'download',
    init: function( editor ) {
        editor.addCommand( 'download', new CKEDITOR.dialogCommand( 'downloadDialog' ) );
        editor.ui.addButton( 'Download', {
            label: 'Download einfügen',
            command: 'download',
            toolbar: 'insert'
        });

        CKEDITOR.dialog.add( 'downloadDialog', this.path + 'dialogs/download.js' );
    }
});