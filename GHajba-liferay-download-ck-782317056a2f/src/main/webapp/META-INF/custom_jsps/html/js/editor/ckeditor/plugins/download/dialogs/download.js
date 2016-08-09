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
CKEDITOR.dialog.add('downloadDialog', function (editor) {
    return {
        title:     'Create download link',
        minWidth:  400,
        minHeight: 200,
        contents:  [
            {
                id:       'info',
                elements: [
                    {
                        type:     'text',
                        id:       'title',
                        label:    'Title',
                        validate: CKEDITOR.dialog.validate.notEmpty("Title must not be empty.")
                    },
                    {
                        type:     'text',
                        id:       'description',
                        label:    'Description',
                        validate: CKEDITOR.dialog.validate.notEmpty("Description must not be empty.")
                    },
                    {
                        type:   'text',
                        id:     'filename',
                        hidden: !0
                    },
                    {
                        type:     'vbox',
                        align:    "right",
                        padding:  0,
                        children: [
                            {
                                id:       "txtUrl",
                                type:     "text",
                                label:    editor.lang.common.url,
                                required: !0,
                                validate: CKEDITOR.dialog.validate.notEmpty('URL is missing.')
                            },
                            {
                                type:        "button",
                                id:          "browse",
                                style:       "display:inline-block;margin-top:10px;",
                                align:       "center",
                                label:       editor.lang.common.browseServer,
                                hidden:      !0,
                                filebrowser: {
                                    action:   'Browse',
                                    onSelect: function (fileUrl, fileName) {

                                        var dialog = this.getDialog();
                                        dialog.getContentElement('info', 'txtUrl').setValue(fileUrl);
                                        dialog.getContentElement('info', 'filename').setValue(fileName);

                                        // Do not call the built-in onSelect command
                                        return false;
                                    }
                                }
                            }
                        ]
                    }
                ]
            }

        ],
        onOk:      function () {
            var dialog = this;

            var downloadElement = editor.document.createElement('div');
            downloadElement.addClass('download-element');

            var downloadBody = editor.document.createElement('div');
            downloadBody.addClass('download-body');

            var downloadHeading = editor.document.createElement('h4');
            downloadHeading.addClass('download-heading');

            var strong = editor.document.createElement('strong');
            strong.setText(dialog.getValueOf('info', 'title'));

            var downloadSimpleList = editor.document.createElement('ul');
            downloadSimpleList.addClass('download-simpleList');
            var li1 = editor.document.createElement('li');
            li1.setText(dialog.getValueOf('info', 'description'));

            var li2 = editor.document.createElement('li');
            li2.setText('Download: ')
            var a = editor.document.createElement('a');
            a.setAttribute('href', dialog.getValueOf('info', 'txtUrl'));
            a.setText(dialog.getValueOf('info', 'filename'));

            var li3 = editor.document.createElement('li');
            var today = new Date();
            li3.setText('Last update: ' + (today.getMonth() + 1) + ' / ' + today.getFullYear());

            strong.appendTo(downloadHeading);
            downloadHeading.appendTo(downloadBody);

            li1.appendTo(downloadSimpleList);
            a.appendTo(li2);
            li2.appendTo(downloadSimpleList);
            li3.appendTo(downloadSimpleList);
            downloadSimpleList.appendTo(downloadBody);

            downloadBody.appendTo(downloadElement);

            editor.insertElement(downloadElement);
        }
    };
})
;