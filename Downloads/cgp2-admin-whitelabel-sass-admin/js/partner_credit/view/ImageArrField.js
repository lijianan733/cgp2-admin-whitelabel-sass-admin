/**
 * @author nan
 * @date 2026/1/27
 * @description TODO
 */
Ext.Loader.syncRequire([
    'Ext.ux.grid.ComponentGrid'
]);
Ext.define('CGP.partner_credit.view.ImageArrField', {
    extend: 'Ext.ux.grid.ComponentGrid',
    alias: 'widget.image_arr_field',
    isField: true,
    minHeight: 120,
    maxHeight: 550,
    autoScroll: true,
    isPaging: true,
    diyGetValue: function () {
        var me = this;
        var data = [];
        me.store.data.items.map(function (record) {
            data.push(record.get('fileName'));
        });
        return data;
    },
    diySetValue: function (data = []) {
        var me = this;
        var arr = data.map(function (item) {
            return {
                fileName: item
            }
        });
        me.store.proxy.data = arr;
        me.store.load();
    },
    getName: function () {
        return this.name;
    },
    isValid: function () {
        return true;
    },
    initComponent: function () {
        var me = this;
        me.hasPagingBar = me.isPaging;
        me.header = {
            style: 'background-color:white;',
            color: 'black',
            title: '<font color=black style="font-weight:normal">' + i18n.getKey('相关凭证:') + '</font>',
            border: '0 0 0 0'
        };
        me.store = Ext.create('Ext.data.Store', {
            xtype: 'store',
            fields: [
                'fileName',
            ],
            proxy: {
                type: me.isPaging ? 'pagingmemory' : 'memory'
            },
            data: []
        });
        me.componentViewCfg = {
            multiSelect: false,
            tableAlign: 'left',
            actionBarCfg: {
                hidden: true,
            },
            renderer: function (record, view) {
                var index = record.index + 1;
                var title = '<font style="font-weight: bold">凭证：'
                    + index + ' &nbsp; &nbsp;&nbsp; &nbsp;&nbsp;</font>';
                //"https://dev-sz-qpson-nginx.qppdev.com/file/file/payment/transactionVouchers/06e524587a8729d90552c3ea16c23a3b.svg"
                var fileName = record.get('fileName');
                var fileType = fileName.split('.').pop();
                var imageUrl = imageServer + (record.get('fileName'));
                if (fileType.toUpperCase() == 'PDF') {//处理pdf文件的情况
                    //转为png后缀
                    //https://dev-sz-qpson-nginx.qppdev.com/file/file/payment/transactionVouchers/2d40a02fbacc6c96e2f2982f89591fa1.png
                    imageUrl = imageUrl.replace(/.pdf|.PDF/g, '.png');
                }
                return {
                    xtype: 'uxfieldset',
                    layout: {
                        type: 'vbox',
                        align: 'center',
                    },
                    border: false,
                    title: title,
                    margin: '0 5',
                    width: 120,
                    height: 130,
                    legendItemConfig: {
                        deleteBtn: {
                            hidden: false,
                            disabled: false,
                            handler: function () {
                                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                                    if (selector == 'yes') {
                                        var store = record.store;
                                        store.proxy.data.splice(index - 1, 1);
                                        store.remove(record);
                                    }
                                });
                            }
                        }
                    },
                    items: [
                        {
                            xtype: 'imagedisplayfield',
                            src: imageUrl,
                            autoEl: 'div',
                            style: 'cursor: pointer',
                            title: i18n.getKey('check') + i18n.getKey('图片')
                        }
                    ]
                };
            }
        };
        me.tbarCfg = {
            btnCreate: {
                text: '添加凭证',
                width: 100,
                handler: function (btn) {
                    var componentGrid = btn.ownerCt.ownerCt.ownerCt;
                    var win = Ext.create('Ext.window.Window', {
                        modal: true,
                        constrain: true,
                        title: '选择文件',
                        items: [
                            {
                                xtype: 'form',
                                itemId: 'fileUpload',
                                border: false,
                                width: 500,
                                height: 130,
                                layout: 'fit',
                                items: [
                                    {
                                        xtype: 'uxfilefield',
                                        labelAlign: 'right',
                                        name: 'file',
                                        itemId: 'file',
                                        onlyImage: true,
                                        allowBlank: false,
                                        margin: '5 25',
                                        buttonText: i18n.getKey('选择'),
                                        fieldLabel: i18n.getKey('文件'),
                                        buttonConfig: {
                                            width: 70
                                        },
                                    }
                                ]
                            }
                        ],
                        bbar: {
                            xtype: 'bottomtoolbar',
                            saveBtnCfg: {
                                handler: function (btn) {
                                    var win = btn.ownerCt.ownerCt;
                                    var form = win.getComponent('fileUpload');
                                    var fileField = form.getComponent('file');
                                    //将items转为htmlform
                                    win.mask();
                                    form.getForm().submit({
                                        url: imageServer + 'uploadv2?dirName=/payment/transactionVouchers',
                                        success: function (form, action) {
                                            win.unmask();
                                            var errorInfo = [];
                                            var fileValidData = [];
                                            action.response.map(function (item) {
                                                //判断哪些上传成功了
                                                if (item.Success) {
                                                    fileValidData.push(item.data);
                                                } else {
                                                    //记录报错信息
                                                    if (item.ErrMsg) {
                                                        errorInfo.push(item.ErrMsg);
                                                    } else {
                                                        const {data} = item,
                                                            {exceptionDetails} = data;
                                                        exceptionDetails?.forEach(messageItem => {
                                                            errorInfo.push(messageItem['message']);
                                                        });
                                                    }
                                                }
                                            });

                                            //报错处理
                                            if (errorInfo.length > 0) {
                                                fileField.reset();//重置组件的值
                                                Ext.Msg.alert(i18n.getKey('prompt'), errorInfo.join('\n'));
                                            }
                                            if (fileValidData.length > 0) {
                                                console.log(fileValidData);
                                                fileValidData.map(function (item) {
                                                    componentGrid.store.proxy.data.push({
                                                        fileName: item.fileName
                                                    });
                                                });
                                                componentGrid.store.load();
                                            }
                                            //成功继续执行
                                            win.close();
                                        },
                                        failure: function (form, action) {
                                            win.unmask();
                                            var msg = action?.response?.data?.message || '上传失败';
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey(msg));
                                        }
                                    });
                                },
                            }
                        }
                    });
                    win.show();
                }
            },
            btnDelete: {
                hidden: true,
            },
            btnImport: {
                hidden: true,
            },
            btnExport: {
                hidden: true,
            },
        };
        me.filterCfg = {
            hidden: true,
        };
        me.callParent();
    }
})