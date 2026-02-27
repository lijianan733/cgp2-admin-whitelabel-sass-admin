/**
 * Created by nan on 2020/12/21
 */
Ext.Loader.syncRequire([
    'CGP.background.view.image.ImagesPanel'
])
Ext.define('CGP.background.view.AddBackGroundWindow', {
    extend: 'Ext.window.Window',
    layout: 'fit',
    modal: true,
    constrain: true,
    resizable: false,
    gridPanel: null,
    bbar: {
        items: [
            '->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_add',
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    var form = win.items.items[0];
                    if (form.isValid()) {
                        var imageGroup = form.getComponent('imageGroup');
                        win.uploadFiles(imageGroup.fileArray, form);
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function (btn) {
                    var me = this;
                    var win = me.ownerCt.ownerCt;
                    win.close();
                }
            }
        ]
    },
    listeners: {
        show: function () {
            var win = this;
            win.setZIndex(1030);
        },
    },
    seriesId: null,
    /**
     * 上传图片的处理
     */
    uploadFiles: function (fileArray, form) {
        form.el.mask('上传中...');
        var cgpFormData = new FormData();
        for (var i = 0; i < fileArray.length; i++) {
            cgpFormData.append("files", fileArray[i]);
        }
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (event) {
            if (this.readyState == 4) {
                if (event.currentTarget.status == 200) {
                    var responseText = event.currentTarget.responseText;
                    var responseData = Ext.JSON.decode(responseText);
                    var filesData = responseData.data;
                    console.log(responseData)
                    var files = [];
                    for (var i = 0; i < filesData.length; i++) {
                        files.push({
                            originalName: filesData[i].originalFileName,
                            url: imageServer + filesData[i].name
                        });
                    }
                    var data = form.getValue();
                    data.files = files;
                    var controller = Ext.create('CGP.background.controller.Controller');
                    controller.builderNewBackground(data, form);
                } else {
                    form.el.unmask();
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('上传失败'));
                }
            }
        };
        xhr.open("POST", adminPath + 'api/files');
        xhr.setRequestHeader('Authorization', 'Bearer ' + Ext.util.Cookies.get('token'));
        xhr.setRequestHeader('Accept', '*/*');
        setTimeout(function () {
            xhr.send(cgpFormData);
        }, 100)

    },
    initComponent: function () {
        var me = this;
        //添加文件上传成功事件
        Ext.WindowManager.zseed = 1000;
        me.addEvents('afterimageupload');
        me.title = i18n.getKey('add') + i18n.getKey('background');
        var colorStore = Ext.create('CGP.color.store.ColorStore', {});
        var backgroundSeriesStore = Ext.create('CGP.background.store.BackgroundSeriesStore')
        me.items = [{
            xtype: 'errorstrickform',
            autoScroll: true,
            maxHeight: 800,
            defaults: {
                padding: '5 10 5 10',
                colspan: 2,
                allowBlank: false
            },
            layout: {
                type: 'table',
                columns: 2
            },
            isValid: function () {
                var me = this;
                var isValid = true;
                var errors = {};
                for (var i = 0; i < me.items.items.length; i++) {
                    var item = me.items.items[i];
                    if (item.xtype == 'toolbar') {
                        continue;
                    } else {
                        if (!item.isValid()) {
                            var errorInfo = item.getErrors();
                            if (Ext.isObject(errorInfo) && !Ext.Object.isEmpty(errorInfo)) {//处理uxfieldContainer的错误信息
                                errors = Ext.Object.merge(errors, errorInfo);
                            } else {
                                errors[item.getFieldLabel()] = errorInfo;
                            }
                            isValid = false;
                        }
                    }
                }
                isValid ? this.msgPanel.hide() : this.showErrors(errors);
                return isValid;
            },
            getValue: function () {
                var me = this;
                var result = {};
                for (var i = 0; i < me.items.items.length; i++) {
                    var item = me.items.items[i];
                    if (item.xtype == 'toolbar') {
                        continue;
                    } else {
                        if (item.diyGetValue) {
                            result[item.getName()] = item.diyGetValue();
                        } else {
                            result[item.getName()] = item.getValue();
                        }
                    }
                }
                return result;
            },
            items: [
                {
                    xtype: 'toolbar',
                    color: 'black',
                    width: '100%',
                    colspan: 2,
                    bodyStyle: 'border-color:white;',
                    border: '0 0 1 0',
                    itemId: 'templateConfigToolBar1',
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: false,
                            value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('图片') + '</font>'
                        }
                    ]
                },
                {
                    xtype: 'imagespanel',
                    height: 250,
                    width: 960,
                    name: 'files',
                    itemId: 'imageGroup',
                    bodyStyle: {
                        'border-color': 'silver'
                    },
                    margin: '5 20 5 20',
                    border: 1,
                },
                {
                    xtype: 'toolbar',
                    color: 'black',
                    width: '100%',
                    bodyStyle: 'border-color:white;',
                    border: '0 0 1 0',
                    itemId: 'templateConfigToolBar2',
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: false,
                            value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('配置信息') + '</font>'
                        }
                    ]
                },
                {
                    xtype: 'gridcombo',
                    fieldLabel: i18n.getKey('withColor'),
                    allowBlank: false,
                    valueField: '_id',
                    padding: '10 10 5 20',
                    displayField: 'colorName',
                    width: 350,
                    colspan: 1,
                    store: colorStore,
                    editable: false,
                    itemId: 'withColor',
                    name: 'withColor',
                    matchFieldWidth: false,
                    filterCfg: {
                        minHeight: 60,
                        layout: {
                            type: 'column',
                            columns: 2
                        },
                        items: [
                            {
                                name: '_id',
                                xtype: 'textfield',
                                hideTrigger: true,
                                isLike: false,
                                allowDecimals: false,
                                fieldLabel: i18n.getKey('id'),
                                itemId: '_id'
                            }, {
                                name: 'colorName',
                                xtype: 'textfield',
                                hideTrigger: true,
                                isLike: false,
                                margin: 0,
                                allowDecimals: false,
                                fieldLabel: i18n.getKey('color') + i18n.getKey('name'),
                                itemId: 'colorName'
                            }
                        ]
                    },
                    gridCfg: {
                        store: colorStore,
                        width: 600,
                        height: 450,
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                dataIndex: '_id',
                                itemId: '_id',
                            }, {
                                text: i18n.getKey('color') + i18n.getKey('name'),
                                dataIndex: 'colorName',
                                itemId: 'colorName',
                                width: 110,
                            }, {
                                text: i18n.getKey('type'),
                                dataIndex: 'clazz',
                                itemId: 'clazz',
                                width: 110,
                                renderer: function (value, mateData, record) {
                                    if (value == 'com.qpp.cgp.domain.common.color.RgbColor') {
                                        return 'RGB颜色';
                                    } else if (value == 'com.qpp.cgp.domain.common.color.CmykColor') {
                                        return 'CMYK颜色';

                                    } else if (value == 'com.qpp.cgp.domain.common.color.SpotColor') {
                                        return 'SPOT颜色';
                                    }
                                }
                            }, {
                                text: i18n.getKey('value'),
                                dataIndex: 'clazz',
                                width: 150,
                                itemId: 'value',
                                renderer: function (value, mateData, record) {
                                    if (value == 'com.qpp.cgp.domain.common.color.RgbColor') {
                                        return 'R:' + record.get('r') + ' G:' + record.get('g') + ' B:' + record.get('b') + '';
                                    } else if (value == 'com.qpp.cgp.domain.common.color.CmykColor') {
                                        return 'C:' + record.get('c') + ' M:' + record.get('m') + ' Y:' + record.get('y') + ' K:' + record.get('k') + '';
                                    }
                                }
                            }, {
                                text: i18n.getKey('显示颜色'),
                                itemId: 'color',
                                dataIndex: 'color',
                                flex: 1,
                            }
                        ],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: colorStore,
                            displayInfo: true,
                            displayMsg: '',
                            emptyMsg: i18n.getKey('noData')
                        })
                    },
                    diyGetValue: function () {
                        var me = this;
                        var data = me.getSubmitValue();
                        if (data.length > 0) {
                            var colorId = data[0];
                            var colorData = me.getValue()[colorId];
                            var colorClazz = colorData.clazz;
                            return {
                                _id: colorId,
                                clazz: colorClazz
                            }
                        } else {
                            return null;
                        }
                    }
                },
                {
                    xtype: 'uxfieldset',
                    colspan: 1,
                    rowspan: 3,
                    padding: '10 10 5 20',
                    itemId: 'rule',
                    name: 'rule',
                    title: i18n.getKey('rule'),
                    width: 350,
                    allowBlank: false,
                    defaults: {
                        allowBlank: false,
                        width: '100%',
                    },
                    items: [
                        {
                            xtype: 'combo',
                            name: 'stretchMode',
                            itemId: 'stretchMode',
                            fieldLabel: i18n.getKey('stretchMode'),
                            editable: false,
                            valueField: 'value',
                            displayField: 'display',
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    'value', 'display'
                                ],
                                data: [
                                    {
                                        value: 'None',
                                        display: i18n.getKey('None'),
                                    },
                                    {
                                        value: 'Uniform',
                                        display: i18n.getKey('Uniform'),
                                    }
                                ]
                            })
                        },
                        {
                            xtype: 'combo',
                            name: 'horizontalClipMode',
                            itemId: 'horizontalClipMode',
                            fieldLabel: i18n.getKey('horizontalClipMode'),
                            valueField: 'value',
                            displayField: 'display',
                            editable: false,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['value', 'display'],
                                data: [
                                    {
                                        value: 'Center',
                                        display: i18n.getKey('Center')
                                    }, {
                                        value: 'Edge',
                                        display: i18n.getKey('Edge')
                                    }, {
                                        value: 'Left',
                                        display: i18n.getKey('Left')
                                    }, {
                                        value: 'Right',
                                        display: i18n.getKey('Right')
                                    }]
                            })
                        },
                        {
                            xtype: 'combo',
                            name: 'verticalClipMode',
                            itemId: 'verticalClipMode',
                            fieldLabel: i18n.getKey('verticalClipMode'),
                            valueField: 'value',
                            displayField: 'display',
                            editable: false,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['value', 'display'],
                                data: [
                                    {
                                        value: 'Center',
                                        display: i18n.getKey('Center')
                                    }, {
                                        value: 'Edge',
                                        display: i18n.getKey('Edge')
                                    }, {
                                        value: 'Top',
                                        display: i18n.getKey('Top')
                                    }, {
                                        value: 'Bottom',
                                        display: i18n.getKey('Bottom')
                                    }
                                ]
                            })
                        },
                        {
                            xtype: 'textfield',
                            value: 'com.qpp.cgp.domain.background.rule.CommonBackgroundGenerateRule',
                            name: 'clazz',
                            hidden: true,
                            allowBlank: true,
                        }
                    ]
                },
                {
                    xtype: 'numberfield',
                    width: 350,
                    padding: '10 10 5 20',
                    name: 'colorOpacity',
                    value: 1,
                    colspan: 1,
                    tipInfo: '1表示不透明,0表示完全透明',
                    fieldLabel: i18n.getKey('withColor') + i18n.getKey('opacity'),
                    minValue: 0,
                    maxValue: 1,
                    step: 0.1,
                    allowDecimals: true
                },
                {
                    xtype: 'numberfield',
                    width: 350,
                    colspan: 1,
                    name: 'outputDPI',
                    padding: '5 10 5 20',
                    fieldLabel: i18n.getKey('输出DPI'),
                    minValue: 0,
                    allowDecimals: false
                },
                {
                    name: 'outputFormat',
                    width: 350,
                    colspan: 2,
                    padding: '5 10 5 20',
                    xtype: 'combo',
                    editable: false,
                    valueField: 'value',
                    displayField: 'display',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'display'],
                        data: [{
                            value: 'jpg',
                            display: 'jpg'
                        }, {
                            value: 'png',
                            display: 'png'
                        }]
                    }),
                    fieldLabel: i18n.getKey('输出文件格式'),
                },
                {
                    xtype: 'uxfieldcontainer',
                    name: 'series',
                    hidden: true,
                    colspan: 1,
                    items: [
                        {
                            name: '_id',
                            xtype: 'textfield',
                            value: me.seriesId
                        },
                        {
                            name: 'clazz',
                            xtype: 'textfield',
                            value: 'com.qpp.cgp.domain.background.BackgroundSeries'
                        }
                    ]
                },
                {
                    xtype: 'toolbar',
                    color: 'black',
                    width: '100%',
                    colspan: 2,
                    bodyStyle: 'border-color:white;',
                    border: '0 0 1 0',
                    itemId: 'templateConfigToolBar3',
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: false,
                            value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('可选尺寸') + '</font>'
                        }
                    ]
                },
                {
                    name: 'sizes',
                    xtype: 'gridfieldwithcrud',
                    itemId: 'options',
                    margin: '5 20 10 20',
                    width: 940,
                    minHeight: 100,
                    maxHeight: 200,
                    winTitle: i18n.getKey('edit') + i18n.getKey('size') + i18n.getKey('config'),
                    gridConfig: {
                        store: Ext.create("Ext.data.Store", {
                                fields: [
                                    'name', 'productWidth', 'productHeight',
                                    {
                                        name: 'cutTop',
                                        type: 'number',
                                        convert: function (value, record) {
                                            if (!Ext.isEmpty(value)) {
                                                return value;
                                            } else {
                                                var cut = record.get('cut');
                                                return Ext.isEmpty(cut) ? 0 : cut.cutTop;
                                            }
                                        }
                                    }, {
                                        name: 'cutBottom',
                                        type: 'number',
                                        convert: function (value, record) {
                                            if (!Ext.isEmpty(value)) {
                                                return value;
                                            } else {
                                                var cut = record.get('cutBottom');
                                                return Ext.isEmpty(cut) ? 0 : cut.cutBottom;
                                            }
                                        }
                                    }, {
                                        name: 'cutLeft',
                                        type: 'number',
                                        convert: function (value, record) {
                                            if (!Ext.isEmpty(value)) {
                                                return value;
                                            } else {
                                                var cut = record.get('cutLeft');
                                                return Ext.isEmpty(cut) ? 0 : cut.cutLeft;
                                            }
                                        }
                                    }, {
                                        name: 'cutRight',
                                        type: 'number',
                                        convert: function (value, record) {
                                            if (!Ext.isEmpty(value)) {
                                                return value;
                                            } else {
                                                var cut = record.get('cutRight');
                                                return Ext.isEmpty(cut) ? 0 : cut.cutRight;
                                            }
                                        }
                                    }, 'unit',
                                    {
                                        name: 'cut',
                                        type: 'object',
                                        convert: function (value, record) {
                                            if (!Ext.isEmpty(value)) {
                                                return value;
                                            } else {
                                                return {
                                                    cutTop: record.get('cutTop'),
                                                    cutBottom: record.get('cutBottom'),
                                                    cutLeft: record.get('cutLeft'),
                                                    cutRight: record.get('cutRight')
                                                }
                                            }
                                        }
                                    }

                                ],
                                proxy: {
                                    type: 'memory'
                                },
                                data: []
                            }
                        ),
                        columns: [
                            {
                                text: i18n.getKey('尺寸描述'),
                                dataIndex: 'name',
                                menuDisabled: true,
                                sortable: false,
                            }, {
                                text: i18n.getKey('产出物宽度'),
                                dataIndex: 'productWidth',
                                menuDisabled: true,
                                sortable: false,
                            }, {
                                text: i18n.getKey('产出物高度'),
                                dataIndex: 'productHeight',
                                menuDisabled: true,
                                sortable: false,
                            },
                            {
                                text: i18n.getKey('出血线位置'),
                                dataIndex: 'cut',
                                menuDisabled: true,
                                width: 250,
                                sortable: false,
                                renderer: function (value, medata, record) {
                                    return '上：' + (record.get('cutTop') || 0) +
                                        ' 下：' + (record.get('cutBottom') || 0) +
                                        ' 左：' + (record.get('cutLeft') || 0) +
                                        ' 右：' + (record.get('cutRight') || 0)
                                }
                            },
                            {
                                text: i18n.getKey('unit'),
                                menuDisabled: true,
                                dataIndex: 'unit',
                                flex: 1,
                                sortable: false,
                            }],
                        extraBtnConfig: [
                            {
                                xtype: 'button',
                                iconCls: 'icon_add',
                                text: i18n.getKey('从已有尺寸添加'),
                                handler: function (btn) {
                                    var grid = btn.ownerCt.ownerCt;
                                    var win = Ext.create('CGP.background.view.SelectImageSizeWin', {
                                        seriesId: me.seriesId,
                                        outGrid: grid
                                    });
                                    win.show();

                                }
                            }
                        ]
                    },
                    formConfig: {
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'name',
                                itemId: 'name',
                                fieldLabel: i18n.getKey('尺寸描述')
                            },
                            {
                                xtype: 'numberfield',
                                hideTrigger: true,
                                minValue: 0,
                                name: 'productWidth',
                                itemId: 'productWidth',
                                fieldLabel: i18n.getKey('产出物宽度')
                            },
                            {
                                xtype: 'numberfield',
                                hideTrigger: true,
                                minValue: 0,
                                name: 'productHeight',
                                itemId: 'productHeight',
                                fieldLabel: i18n.getKey('产出物高度')
                            },
                            {
                                xtype: 'uxfieldcontainer',
                                fieldLabel: i18n.getKey('出血线位置'),
                                name: 'cut',
                                labelAlign: 'left',
                                itemId: 'cut',
                                layout: {
                                    type: 'table',
                                    columns: 2
                                },
                                defaults: {
                                    width: 120,
                                    labelWidth: 30,
                                },
                                items: [
                                    {
                                        xtype: 'numberfield',
                                        hideTrigger: true,
                                        minValue: 0,
                                        name: 'cutTop',
                                        itemId: 'cutTop',
                                        allowBlank: true,
                                        fieldLabel: i18n.getKey('up')
                                    }, {
                                        xtype: 'numberfield',
                                        hideTrigger: true,
                                        minValue: 0,
                                        name: 'cutBottom',
                                        itemId: 'cutBottom',
                                        allowBlank: true,
                                        fieldLabel: i18n.getKey('down')
                                    }, {
                                        xtype: 'numberfield',
                                        hideTrigger: true,
                                        minValue: 0,
                                        name: 'cutLeft',
                                        itemId: 'cutLeft',
                                        allowBlank: true,
                                        fieldLabel: i18n.getKey('left')
                                    }, {
                                        xtype: 'numberfield',
                                        hideTrigger: true,
                                        name: 'cutRight',
                                        itemId: 'cutRight',
                                        allowBlank: true,
                                        fieldLabel: i18n.getKey('right')
                                    }
                                ]
                            },
                            {
                                xtype: 'combo',
                                name: 'unit',
                                fieldLabel: i18n.getKey('unit'),
                                itemId: 'unit',
                                value: 'mm',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['value', 'display'],
                                    data: [

                                        {
                                            value: 'cm',
                                            display: i18n.getKey('cm')
                                        },
                                        {
                                            value: 'mm',
                                            display: i18n.getKey('mm')
                                        },
                                        {
                                            value: 'in',
                                            display: i18n.getKey('in')
                                        }
                                    ]
                                }),
                                editable: false,
                                valueField: 'value',
                                displayField: 'display'
                            }
                        ]
                    },
                    saveHandler: function (btn) {
                        var form = btn.ownerCt.ownerCt;
                        var win = form.ownerCt;
                        if (form.isValid()) {
                            var data = {};
                            form.items.items.forEach(function (item) {
                                if (item.disabled == false) {
                                    //自定义获取值优先级高于普通getValue
                                    if (item.diyGetValue) {
                                        data[item.getName()] = item.diyGetValue();
                                    } else {
                                        data[item.getName()] = item.getValue();
                                    }
                                }
                            });
                            console.log(data);
                            if (data.cut) {
                                data = Ext.Object.merge(data, data.cut);

                            }
                            if (win.createOrEdit == 'create') {
                                win.outGrid.store.add(data);
                            } else {
                                for (var i in data) {
                                    win.record.set(i, data[i]);
                                }
                            }
                            win.close();
                        }
                    },
                    diyGetValue: function () {
                        var me = this;
                        return me.getSubmitValue();
                    }
                }
            ]
        }];
        me.callParent();
    }
})