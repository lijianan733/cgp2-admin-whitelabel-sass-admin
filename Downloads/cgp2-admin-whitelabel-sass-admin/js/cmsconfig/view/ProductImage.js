/**
 * @Description:
 * @author nan
 * @date 2022/4/28
 */
Ext.apply(Ext.form.field.VTypes, {
    filePath: function (v) {
        return !/^[/]$/.test(v);
    },
    filePathText: '路径不允许只输入"/"',
    filePathMask: /[\w/]$/i     //限制输入
});
Ext.define('CGP.cmsconfig.view.ProductImage', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.productimage',
    title: i18n.getKey('product') + i18n.getKey('image'),
    itemId: 'productImage',
    layout: 'fit',
    border: false,
    autoScroll: true,
    data: null,
    getValue: function () {
        var me = this;
        var store = me.items.items[0].getStore();
        var result = [];
        store.data.items.map(function (item) {
            result.push(item.getData())
        });
        return {
            productImages: result
        };
    },
    setValue: function (data) {
        var me = this;
        var productImages = data.productImages || [];
        me.data = {
            productImages: data.productImages
        }
        var store = me.items.items[0].getStore();
        store.proxy.data = productImages;
        store.load();
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        if (me.allowBlank == false && me.store.getCount() == 0) {
            isValid = false;
        }
        return isValid;
    },
    initComponent: function () {
        var me = this;
        var uploadHandler = function (button) {
            var formPanel = this.ownerCt.ownerCt;
            var win = formPanel.ownerCt;
            var file = formPanel.getComponent('file');
            var url = win.fileUpLoadField.aimFileServerUrl + '?access_token=' + Ext.util.Cookies.get('token');
            var fileUpLoadField = win.fileUpLoadField;
            var filePath = win.fileUpLoadField.getComponent('filePath');
            if (!Ext.isEmpty(file.getRawValue())) {
                var myMask = new Ext.LoadMask(win, {msg: "上传中..."});
                myMask.show();
                formPanel.getForm().submit({
                    url: url,
                    method: 'POST',
                    success: function (form, action) {
                        myMask.hide();
                        var fileValidData = [];
                        action.response.map(function (item) {
                            fileValidData.push(item.data);
                        });
                        var result = fileValidData[0];
                        result.name = result.fileName;
                        var rawData = win.fileUpLoadField.rawData = result;
                        if (win.fileUpLoadField.valueUrlType == 'full') {
                            filePath.setValue(rawData.url);
                        } else {
                            filePath.setValue(rawData.fileName);
                        }
                        win.close();
                        if (fileUpLoadField.verifySuffix(rawData.originalFileName)) {
                            if (rawData.width == 0 && rawData.height == 0) {
                                Ext.Msg.alert(i18n.getKey('prompt'), '该图片宽高为零,不符合要求');
                                fileUpLoadField.setValue();
                            }
                        }
                        //上传成功后的回调处理
                        fileUpLoadField.uploadCallback?.bind(fileUpLoadField)(fileUpLoadField.rawData);
                    },
                    failure: function (form, action) {
                        myMask.hide();
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('上传失败'));
                    }
                });
            }
        };
        var validFile = function () {
            var me = this;
            me.Errors = {};
            var valid = true;
            var filePath = me.getComponent('filePath');
            valid = filePath.isValid();
            if (valid == false) {
                me.Errors[me.getFieldLabel()] = filePath.getErrors();
            } else {
                var rawData = me.rawData;
                if (me.limit) {
                    if (me.limit.diffUnit == 'Pixel') {
                        if (Math.abs(me.limit.width - rawData.width) > me.limit.diff) {
                            valid = false;
                        }
                        if (Math.abs(me.limit.height - rawData.height) > me.limit.diff) {
                            valid = false;
                        }
                    } else {
                        if (Math.abs(me.limit.width - rawData.width) > (me.limit.width * me.limit.diff * 0.01)) {
                            valid = false;
                        }
                        if (Math.abs(me.limit.height - rawData.height) > (me.limit.height * me.limit.diff * 0.01)) {
                            valid = false;
                        }
                    }
                }
                if (valid == false) {

                    me.Errors[me.getFieldLabel()] = `当前图片大小为${rawData.width}*${rawData.height}，不符合要求`;
                }
            }
            return valid;
        };
        var getFileLabel = function () {
            var me = this;
            var label = me.fieldLabelStr;
            var imageSizeLimits = me.ownerCt.ownerCt.outGrid.ownerCt.ownerCt.imageSizeLimits || [];
            console.log(imageSizeLimits);
            var limit = null;
            for (var i = 0; i < imageSizeLimits.length; i++) {
                if (imageSizeLimits[i].key == me.name) {
                    limit = imageSizeLimits[i];
                }
            }
            me.limit = limit;
            if (limit) {
                label += '(<font color="red">' + limit.width + '*' + limit.height + '</font>,允许误差' + limit.diff + limit.diffUnit + ')';
            }
            return label;
        };
        me.items = [
            {
                xtype: 'gridwithcrud',
                border: false,
                itemId: 'gridwithcrud',
                store: {
                    xtype: 'store',
                    fields: [
                        {
                            name: 'small',
                            type: 'object'
                        },
                        {
                            name: 'large',
                            type: 'object'
                        },
                        {
                            name: 'title',
                            type: 'string'
                        },
                        {
                            name: 'alt',
                            type: 'string'
                        },
                        {
                            name: 'imageInfo',
                            type: 'string',
                            convert: function (value, record) {
                                var result = [];
                                result.push(
                                    {
                                        title: i18n.getKey('title'),
                                        value: record.get('title')
                                    },
                                    {
                                        title: i18n.getKey('图片提示信息'),
                                        value: record.get('alt')
                                    }
                                );
                                return JSCreateHTMLTable(result, 'left');
                            }
                        }
                    ],
                    pageSize: 25,
                    autoLoad: true,
                    proxy: {
                        type: 'memory'
                    },
                    data: []
                },
                viewConfig: {
                    plugins: {
                        ptype: 'gridviewdragdrop',
                        dragText: '可用鼠标拖拽进行上下排序'
                    }
                },
                columns: [
                    {
                        text: i18n.getKey('image'),
                        dataIndex: 'imageInfo',
                        xtype: 'gridcolumn',
                        width: 300,
                    },
                    {
                        xtype: 'imagecolumn',
                        tdCls: 'vertical-middle',
                        width: 300,
                        dataIndex: 'small',
                        text: i18n.getKey('小图'),
                        buildUrl: function (value, metadata, record) {
                            if (value) {
                                var imageUrl = value.name;
                                var src = imageServer + imageUrl;
                                return src;
                            }
                        },
                        buildPreUrl: function (value, metadata, record) {
                            if (value) {
                                var imageUrl = value.name;
                                var src = imageServer + imageUrl;
                                return src;
                            }
                        },
                        buildTitle: function (value, metadata, record) {
                            if (value) {
                                var imageUrl = value.name;
                                return `${i18n.getKey('check')} < ${imageUrl} > 预览图`;
                            }
                        }
                    },
                    {
                        xtype: 'imagecolumn',
                        tdCls: 'vertical-middle',
                        width: 300,
                        dataIndex: 'large',
                        text: i18n.getKey('大图'),
                        buildUrl: function (value, metadata, record) {
                            if (value) {
                                var imageUrl = value.name;
                                var src = imageServer + imageUrl;
                                return src;
                            }
                        },
                        buildPreUrl: function (value, metadata, record) {
                            if (value) {
                                var imageUrl = value.name;
                                var src = imageServer + imageUrl;
                                return src;
                            }
                        },
                        buildTitle: function (value, metadata, record) {
                            if (value) {
                                var imageUrl = value.name;
                                return `${i18n.getKey('check')} < ${imageUrl} > 预览图`;
                            }
                        }
                    },
                ],
                winConfig: {
                    winTitle: '添加产品图',
                    formConfig: {
                        isValidForItems: true,
                        defaults: {
                            msgTarget: 'none',
                            margin: '10 25',
                            width: 500
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'title',
                                itemId: 'title',
                                fieldLabel: i18n.getKey('title')
                            },
                            {
                                xtype: 'textfield',
                                name: 'alt',
                                itemId: 'alt',
                                fieldLabel: i18n.getKey('图片提示信息')
                            },
                            {
                                xtype: 'fileuploadv2',
                                name: 'small',
                                itemId: 'smallImage',
                                fieldLabelStr: i18n.getKey('小图'),
                                valueVtype: 'filePath',
                                allowFileType: ['image/*'],
                                UpFieldLabel: i18n.getKey('image'),
                                editable: false,
                                valueUrlType: 'object',
                                uploadHandler: uploadHandler,
                                getFieldLabel: getFileLabel,
                                isValid: validFile
                            },
                            {
                                xtype: 'fileuploadv2',
                                name: 'large',
                                itemId: 'largeImage',
                                fieldLabelStr: i18n.getKey('大图'),
                                valueVtype: 'filePath',
                                allowFileType: ['image/*'],
                                editable: false,
                                valueUrlType: 'object',
                                UpFieldLabel: i18n.getKey('image'),
                                uploadHandler: uploadHandler,
                                getFieldLabel: getFileLabel,
                                isValid: validFile
                            }
                        ]
                    }
                },
                tbar: {
                    btnDelete: {
                        xtype: 'displayfield',
                        width: 600,
                        value: '<font color="red">允许拖拽表格行调整数据顺序</font>',
                        hidden: false,
                    }
                }
            }
        ]
        me.callParent(arguments);
    }
})