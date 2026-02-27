/**
 * Created by nan on 2019/8/14.
 */
Ext.define('CGP.monthimagegroup.view.ImageGroup', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    valid: true,//标识编辑状态
    alias: 'widget.imagegroup',
    fileArray: null,//复制的filelist，用于创建新的FormData中传输文件
    removeFileArr: null,
    imageData: null,
    isValid: function () {
        var me = this;
        return me.validate();
    },
    getName: function () {
        return this.name;
    },
    getErrors: function () {
        return '不允许为空';
    },
    getFieldLabel: function () {
        return '图片'
    },
    //当grid添加数据之后清除不能为空的错误提示。
    clearError: function () {
        var me = this;
        var form = me.items.items[0];
        form.body.setStyle('borderColor', 'silver #d9d9d9 #d9d9d9');
    },
    renderActiveError: function () {
        var me = this;
    },
    //重写displayfield的验证方法，根据grid有无值来校验
    validate: function () {
        var me = this;
        if (me.disabled) {
            return true;
        }
        if (me.fileArray.length == 0) {
            me.valid = false;
        } else {
            me.valid = true;
        }
        me.renderActiveError();
        return me.valid;
    },
    getValue: function () {
        var me = this;
        var form = me.getComponent('previewForm');
        var result = [];
        for (var i = 0; i < form.items.items.length; i++) {
            var item = form.items.items[i];
            result.push(item.imageData);
        }
        return result;

    },
    setValue: function (imageDatas) {
        var me = this;
        me.imageData = {};
        var form = me.getComponent('previewForm');
        for (var i = 0; i < imageDatas.length; i++) {
            var id = imageDatas[i].year + '' + imageDatas[i].month;
            me.imageData[id] = imageDatas[i];
            form.addImage(imageDatas[i]);
        }
    },
    initComponent: function () {
        var me = this;
        me.imageData = {};
        //添加自定义事件
        me.addEvents({
            countChange: true,//选择的文件数量发生改变
            allFileRender: true
        });
        me.fileArray = [];
        me.removeFileArr = [];
        /**
         * 删除选择的文件
         * @param itemId
         */
        window.deleteFile = function (itemId) {
            var field = Ext.getCmp(itemId);
            var form = field.ownerCt;
            var panel = form.ownerCt;
            var index = field.ownerCt.items.items.indexOf(field);
            panel.fileArray.splice(index, 1);
            var sourceName = field.imageData.sourceName.split('.')[0];
            delete form.ownerCt.imageData[sourceName];
            form.remove(field);
            panel.fireEvent('countChange', {count: panel.fileArray.length});
        };
        /**
         * 查看图片
         * @param itemId
         */
        window.preview = function (itemId) {
            var field = Ext.getCmp(itemId);
            var fileName = field.name;
            var win = Ext.create('Ext.ux.window.CheckImageWindow', {
                src: field.url,
                title: i18n.getKey('图片_') + fileName
            });
            win.show();
        };
        window.checkConfigInfo = function (itemId) {
            var field = Ext.getCmp(itemId);
            var imageData = field.imageData;
            var win = Ext.create('Ext.window.Window', {
                title: '月份图配置',
                modal: true,
                constrain: true,
                items: [
                    {
                        xtype: 'errorstrickform',
                        defaults: {
                            width: 450,
                            margin: '10 25 5 25'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'sourceName',
                                fieldLabel: i18n.getKey('sourceName'),
                                readOnly: true,
                                fieldStyle: 'background-color: silver',//设置文本框的样式
                            },
                            {
                                xtype: 'combo',
                                name: 'year',
                                readOnly: true,
                                fieldStyle: 'background-color: silver',//设置文本框的样式
                                fieldLabel: i18n.getKey('year'),
                                valueField: 'id',
                                displayField: 'id',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['id'],
                                    data: [{
                                        id: '12313'
                                    }]
                                })
                            },
                            {
                                xtype: 'textfield',
                                name: 'clazz',
                                hidden: true,
                                value: "com.qpp.cgp.domain.preprocess.holiday.MonthImage"
                            },
                            {
                                xtype: 'textfield',
                                name: 'month',
                                readOnly: true,
                                fieldStyle: 'background-color: silver',//设置文本框的样式
                                fieldLabel: i18n.getKey('month')
                            },
                            {
                                xtype: 'fileuploadv2',
                                name: 'imageName',
                                allowFileType: ['image/png'],
                                fieldLabel: i18n.getKey('月份图(PNG)'),
                                valueUrlType: 'part',   //完整路径 full, 部分路径 part, 文件信息 object

                            },
                            {
                                xtype: 'fileuploadv2',
                                name: 'printFile',
                                allowFileType: ['application/pdf'],
                                fieldLabel: i18n.getKey('月份图(PDF)'),
                                valueUrlType: 'part',   //完整路径 full, 部分路径 part, 文件信息 object
                            }
                        ],
                        bbar: [
                            '->',
                            {
                                xtype: 'button',
                                text: i18n.getKey('confirm'),
                                iconCls: 'icon_agree',
                                handler: function (btn) {
                                    var form = btn.ownerCt.ownerCt;
                                    var win = form.ownerCt;
                                    var data = form.getValue();
                                    var imageForm = field.ownerCt;
                                    console.log(data);
                                    var sourceName = data.sourceName.split('.')[0];
                                    imageForm.ownerCt.imageData[sourceName] = data;
                                    imageForm.refreshData();
                                    win.close();
                                }
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('cancel'),
                                iconCls: 'icon_cancel',
                                handler: function (btn) {
                                    var form = btn.ownerCt.ownerCt;
                                    var win = form.ownerCt;
                                    win.close();
                                }
                            }
                        ],
                        listeners: {
                            afterrender: function () {
                                var form = this;
                                if (imageData) {
                                    form.setValue(imageData);
                                }
                            }
                        }
                    }
                ]
            })
            win.show();

        };
        me.items = [
            {
                xtype: 'form',
                border: false,
                header: false,
                autoScroll: true,
                itemId: 'previewForm',
                layout: {
                    type: 'column'
                },
                bodyStyle: 'border-color:silver;',
                items: [],
                /**
                 *
                 * @param pdfFileURL 文件路径
                 * @param file 具体的file类型对象
                 * @param img  需要渲染图片的位置
                 */
                buildImg: function (fileName, fieldId, url) {
                    var img = new Image();
                    var imgDiv = document.getElementById('img-' + fieldId);
                    img.onload = function () {
                        var image = this;
                        image.style['max-width'] = '100%';
                        image.style['max-height'] = '100%';
                    }
                    img.src = url;
                    //图片点击预览
                    img.onclick = function () {
                        window.preview(fieldId);
                    };
                    img.onmouseover = function () {
                        this.style.cursor = 'pointer';
                    }
                    img.style['title'] = '查看'
                    imgDiv.append(img);
                },
                addImage: function (imageData) {
                    var me = this;
                    var deleteImg = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png';
                    var previewImg = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/preview.png';
                    var configImg = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/cog.png';
                    var fieldId = JSGetUUID();
                    var fileName = imageData.sourceName.split('.')[0];
                    var url = imageData.imageName ? (imageServer + imageData.imageName) : (imageServer + imageData.printFile + '?format=PNG');
                    var color = imageData.imageName ? 'green' : 'red';//有无png图
                    var data = {
                        id: fieldId,
                        fileName: fileName,
                        name: fileName,
                        url: url,
                        xtype: 'container',
                        columnWidth: 0.2,
                        margin: 10,
                        imageData: imageData,
                        hideLabel: true,
                        uploadId: JSGetUUID(),
                        html: "<div>" +
                            "<div  align='center' style='margin:0px 10px 0px 10px;border: 1px solid " + color + ";border-radius:10px;height: auto;height: 150px;' id=" + 'img-' + fieldId + "></div>" +
                            "<div align='center'  style='white-space:normal;word-wrap:break-word; overflow:hidden;'>" + fileName + "</div>" +
                            "<div align='center'>" +
                            "<img title='删除' src='" + deleteImg + "' style='vertical-align: middle;width:16px; height:16px; margin-right:8px;' onclick='deleteFile(\"" + fieldId + "\")'/>" +
                            "<img title='查看图片' src='" + previewImg + "' style='vertical-align: middle;width:16px; height:16px; margin-left:8px;margin-right:8px;' onclick='preview(\"" + fieldId + "\")'/>" +
                            "<img title='查看配置信息' src='" + configImg + "' style='vertical-align: middle;width:16px; height:16px; margin-left:8px;' onclick='checkConfigInfo(\"" + fieldId + "\")'/>" +
                            "</div>" +
                            "</div>",
                        listeners: {
                            afterrender: function (field) {
                                var form = field.ownerCt;
                                form.buildImg(field.imageData.sourceName, field.id, field.url);
                            }
                        }
                    };
                    var field = me.add(data);
                },
                /**
                 * 上传图片的处理
                 */
                uploadFiles: function (fileArray, form) {
                    form.el.mask('上传中...');
                    var cgpFormData = new FormData();
                    var count = 0;
                    for (var i = 0; i < fileArray.length; i++) {
                        cgpFormData.set("files", fileArray[i]);
                        var xhr = new XMLHttpRequest();
                        xhr.onreadystatechange = function (event) {
                            if (this.readyState == 4) {
                                if (event.currentTarget.status == 200) {
                                    count++;
                                   ;
                                    var responseText = event.currentTarget.responseText;
                                    var responseData = Ext.JSON.decode(responseText);
                                    var filesData = responseData.data;
                                    for (var i = 0; i < filesData.length; i++) {
                                        var sourceName = filesData[i].originalFileName;
                                        sourceName = sourceName.split('.')[0];
                                        var year = sourceName.slice(0, 4);
                                        var month = sourceName.slice(4,);
                                        var rawData = {
                                            clazz: "com.qpp.cgp.domain.preprocess.holiday.MonthImage",
                                            month: month,
                                            sourceName: sourceName + '.pdf',
                                            year: year
                                        };
                                        if (filesData[i].format == 'pdf') {
                                            rawData.printFile = filesData[i].name;
                                        } else {
                                            rawData.imageName = filesData[i].name;
                                        }
                                        if (form.ownerCt.imageData[sourceName + '']) {//已经存在,更新数据
                                            form.ownerCt.imageData[sourceName + ''] = Ext.Object.merge(form.ownerCt.imageData[sourceName + ''], rawData)
                                        } else {
                                            //添加展示组件
                                            form.ownerCt.imageData[sourceName + ''] = rawData;
                                        }
                                        if (count == fileArray.length) {
                                            form.el.unmask();
                                            form.refreshData();
                                        }

                                    }
                                } else {
                                    form.el.unmask();
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('上传失败'));
                                }
                            }
                        };
                        xhr.open("POST", adminPath + 'api/files');
                        xhr.setRequestHeader('Authorization', 'Bearer ' + Ext.util.Cookies.get('token'));
                        xhr.setRequestHeader('Accept', '*/*');
                        const body = cgpFormData;
                        xhr.send(body);
                    }


                },
                refreshData: function () {
                    var me = this;
                    var imageData = me.ownerCt.imageData;
                    me.removeAll();
                    for (var i in imageData) {
                        me.addImage(imageData[i]);
                    }
                },
                tbar: [
                    {
                        xtype: 'filefield',
                        buttonOnly: true,
                        buttonConfig: {
                            iconCls: 'icon_folder',
                            text: i18n.getKey('选择文件')
                        },
                        /**
                         * 设置文件上传组件的配置
                         * @param field
                         */
                        supporMultFn: function (field) {
                            //允许使用的文件类型
                            var typeArray = [
                                "application/pdf",
                                "image/png",
                            ];
                            var fileDom = field.getEl().down('input[type=file]');
                            fileDom.dom.setAttribute("multiple", "multiple");
                            fileDom.dom.setAttribute("accept", typeArray.join(","));
                            if (!Ext.isEmpty(this.uploadFolder) && this.uploadFolder == true) {
                                fileDom.dom.setAttribute('webkitdirectory', 'webkitdirectory');
                            }
                        },
                        listeners: {
                            afterrender: function () {
                                this.supporMultFn(this);
                            },
                            change: function (comp, newValue, oldValue) {
                                this.supporMultFn(this);
                                var previewForm = comp.ownerCt.ownerCt;
                                var files = this.fileInputEl.dom.files;
                                previewForm.uploadFiles(files, previewForm);
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        text: i18n.getKey('clear'),
                        iconCls: 'icon_clear',
                        handler: function (btn) {
                            var previewForm = btn.ownerCt.ownerCt;
                            var panel = previewForm.ownerCt;
                            panel.fileArray = [];
                            previewForm.removeAll();
                            panel.fireEvent('countChange', {
                                count: 0
                            });
                        }
                    }
                ]
            }
        ];
        me.listeners = {
            'countChange': function () {
                var me = this;
                me.validate();
            },
        };
        me.callParent();
    }
})
