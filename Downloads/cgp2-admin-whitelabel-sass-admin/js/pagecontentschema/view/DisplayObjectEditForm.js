/**
 * Created by nan on 2020/8/25.
 */
Ext.Loader.syncRequire([
    'CGP.pagecontentschema.view.ShapeConfigFieldSet',
    'CGP.pagecontentschema.view.TSpanFieldSet',
    'CGP.pagecontentschema.view.pagecontentitemplaceholders.model.ColorModel',
    'CGP.pagecontentschema.view.StyleFieldSet',
    'CGP.pagecontentschema.config.Config'
])
Ext.define('CGP.pagecontentschema.view.DisplayObjectEditForm', {
    extend: "Ext.ux.form.ErrorStrickForm",
    alias: 'widget.displayobjecteditform',
    defaults: {
        margin: '10 25 5 25',
        width: 600,
    },
    clazzReadOnly: false,
    scrollData: {
        left: 0,
        top: 0
    },
    isValidForItems: true,
    data: null,
    colorStore: null,
    diySetValue: function (data) {
        var me = this;
        var clazz = data.clazz;
        me.suspendLayouts();
        /*   var components = me.buildItems(clazz);
           me.add(components);*/
        me.setValue(data);
        me.resumeLayouts();
        me.doLayout();
    },
    buildItems: function (clazz) {
        var me = this;
        var colorStore = me.colorStore;
        var mapping = CGP.pagecontentschema.config.Config.mapping;
        var resource = CGP.pagecontentschema.config.Config.resource;
        var components = [
            {
                xtype: 'combo',
                itemId: 'clazz',
                name: 'clazz',
                editable: false,
                readOnly: me.clazzReadOnly,
                fieldLabel: resource['type'],
                valueField: 'value',
                displayField: 'display',
                value: 'Path',
                store: {
                    xtype: 'store',
                    fields: ['value', 'display'],
                    //这是所有的组件
                    data: CGP.pagecontentschema.config.Config.displayObjectComponentList.concat([{
                        value: 'Container',
                        display: 'Container'
                    }])
                },
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var fieldSet = combo.ownerCt;
                        for (var i = 0; i < fieldSet.items.items.length; i++) {
                            var item = fieldSet.items.items[i];
                            if (Ext.Array.contains(mapping['common'], item.itemId)) {

                            } else {
                                try {
                                    if (Ext.Array.contains(mapping[newValue], item.itemId)) {
                                        item.show();
                                        item.setDisabled(false);
                                    } else {
                                        item.hide();
                                        item.setDisabled(true);
                                    }
                                } catch (e) {
                                    Ext.Msg.alert(resource['prompt'], resource['不支持的displayObject类型']);
                                }
                            }
                        }
                    }
                }
            },
            {
                xtype: 'numberfield',
                name: '_id',
                itemId: '_id',
                hidden: true,
                fieldLabel: resource['_id']
            },
            {
                xtype: 'checkbox',
                itemId: 'readOnly',
                fieldLabel: resource['readOnly'],
                name: 'readOnly',
                checked: false
            },
            {
                xtype: 'textfield',
                name: 'description',
                itemId: 'description',
                fieldLabel: resource['description']
            },
            {
                xtype: 'combo',
                name: 'visible',
                itemId: 'visible',
                fieldLabel: resource['is'] + resource['show'],
                editable: false,
                valueField: 'value',
                displayField: 'display',
                value: true,
                store: {
                    xtype: 'store',
                    fields: ['value', 'display'],
                    data: [
                        {
                            value: true,
                            display: resource['true']
                        },
                        {
                            value: false,
                            display: resource['false']
                        }
                    ]
                }
            },
            {
                xtype: 'numberfield',
                name: 'alpha',
                itemId: 'alpha',
                hidden: true,
                fieldLabel: resource['alpha'],
                minValue: 0,
                maxValue: 1
            },
            {
                xtype: 'arraydatafield',
                name: 'tags',
                itemId: 'tags',
                rows: 1,
                height: 50,
                grow: true,
                maxHeight: 100,
                resultType: 'Array',
                allowChangSort: true,
                fieldLabel: resource['标签组'],
                emptyText: '值为一数组,如：["id","color"]',
            },
            {
                xtype: 'numberfield',
                name: 'x',
                itemId: 'x',
                allowBlank: false,
                fieldLabel: resource['x'],
                emptyText: '偏移量（x,y）四舍五入',
                submitEmptyText: false
            },
            {
                xtype: 'numberfield',
                name: 'y',
                itemId: 'y',
                allowBlank: false,
                fieldLabel: resource['y'],
                emptyText: '偏移量（x,y）四舍五入',
                submitEmptyText: false
            },
            {
                xtype: 'numberfield',
                name: 'width',
                itemId: 'width',
                minValue: 0,
                allowBlank: false,
                fieldLabel: resource['width'],
                emptyText: 'width，height向上取整',
                submitEmptyText: false,
                listeners: {
                    change: function (textfield, newValue, oldValue) {
                        var imageWidth = textfield.ownerCt.getComponent('imageWidth');
                        imageWidth.setValue(newValue);
                    }
                }
            },
            {
                xtype: 'numberfield',
                name: 'height',
                minValue: 0,
                itemId: 'height',
                allowBlank: false,
                fieldLabel: resource['height'],
                emptyText: 'width，height向上取整',
                submitEmptyText: false,
                listeners: {
                    change: function (textfield, newValue, oldValue) {
                        var imageHeight = textfield.ownerCt.getComponent('imageHeight');
                        imageHeight.setValue(newValue);
                    }
                }
            },
            {
                xtype: 'numberfield',
                name: 'rotation',
                itemId: 'rotation',
                fieldLabel: resource['rotation']
            },
            {
                xtype: 'numberfield',
                name: 'scale',
                itemId: 'scale',
                allowDecimals: true,
                value: 1,
                minValue: 0,
                allowBlank: true,
                tipInfo: '缩放比例,1代表原始尺寸',
                fieldLabel: resource['scale']
            },
            {
                xtype: 'numberfield',
                name: 'zIndex',
                itemId: 'zIndex',
                allowDecimals: false,
                minValue: 0,
                allowBlank: true,
                tipInfo: '该值较大的配置将叠放在该值较小的配置之上',
                fieldLabel: resource['zIndex']
            },
            {
                xtype: 'shapeconfigfieldset',
                name: 'clipPath',
                itemId: 'clipPath',
                title: 'clipPath',
                onlySubProperty: true,
                fieldLabel: resource['clipPath']
            },
            {
                //该字段有两种类型,string和itextContent，后一种暂时不实现
                xtype: 'textfield',
                name: 'text',
                itemId: 'text',
                fieldLabel: resource['text'],
                title: 'text',
            },
            {
                xtype: 'combo',
                name: 'type',
                itemId: 'type',
                fieldLabel: resource['technology'] + resource['type'],
                editable: false,
                valueField: 'value',
                displayField: 'display',
                store: {
                    xtype: 'store',
                    fields: ['value', 'display'],
                    data: [
                        {
                            value: 'Embroidery',
                            display: resource['刺绣']
                        },
                        {
                            value: 'Printing',
                            display: resource['print']
                        }
                    ]
                }
            },
            {
                xtype: 'textfield',
                name: 'textFileName',
                itemId: 'textFileName',
                fieldLabel: resource['textFileName']
            },
            {
                xtype: 'shapeconfigfieldset',
                name: 'path',
                itemId: 'path',
                title: 'path',
                clazzReadOnly: true,
                onlySubProperty: true,
                listeners: {
                    afterrender: function () {
                        var fieldset = this;
                        var clazz = fieldset.getComponent('clazz');
                        clazz.setValue('Path');
                    }
                },
                fieldLabel: resource['path']
            },
            {
                xtype: 'stylefieldset',
                name: 'style',
                itemId: 'style',
                title: 'style',
            },
            {
                xtype: 'numberfield',
                fieldLabel: resource['originalWidth'],
                name: 'originalWidth',
                itemId: 'originalWidth',
            },
            {
                xtype: 'numberfield',
                fieldLabel: resource['originalHeight'],
                name: 'originalHeight',
                itemId: 'originalHeight',
            },
            {
                xtype: 'textfield',
                fieldLabel: resource['printFile'],
                name: 'printFile',
                allowBlank: true,
                itemId: 'printFile',
                emptyText: '全路径地址,http://*****/file/****.png或文件名,****.*'
            },
            {
                xtype: 'fileuploadv2',
                fieldLabel: resource['imageName'],
                name: 'imageName',
                allowBlank: true,
                valueUrlType: 'part',
                itemId: 'imageName',
                allowFileType: ['image/*', 'application/pdf']
            },
            {
                xtype: 'combo',
                name: 'displayName',
                itemId: 'displayName',
                editable: true,
                valueField: 'value',
                displayField: 'display',
                fieldLabel: resource['displayName'],
                store: {
                    xtype: 'store',
                    fields: ['value', 'display'],
                    data: [
                        {
                            value: 'PRINT_TYPE',
                            display: 'PRINT_TYPE'
                        }
                    ]
                }

            },
            {
                name: 'contentTransform',
                xtype: 'uxfieldset',
                itemId: 'contentTransform',
                title: resource['contentTransform'],
                legendItemConfig: {
                    disabledBtn: {
                        isUsable: false,
                        hidden: false,
                        disabled: false,
                    }
                },
                layout: {
                    type: 'table',
                    columns: 2
                },
                diyGetValue: function () {
                    var me = this;
                    if (me.legend.getComponent('disabledBtn').isUsable == false) {
                        return null;
                    } else {
                        var result = [];
                        for (var i = 0; i < me.items.items.length; i++) {
                            result.push(me.items.items[i].getValue());
                        }
                        return result;
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    me.suspendLayouts();
                    var disabledBtn = me.legend.getComponent('disabledBtn');
                    if (data) {
                        for (var i = 0; i < me.items.items.length; i++) {
                            me.items.items[i].setValue(data[i]);
                        }
                        disabledBtn.count = 1;
                        disabledBtn.handler();
                    } else {
                        disabledBtn.count = 0;
                        disabledBtn.handler();
                    }
                    me.resumeLayouts();
                    me.updateLayout();
                },
                defaults: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    decimalPrecision: 4,
                    labelWidth: 50,
                    labelAlign: 'right',
                    flex: 1
                },
                items: [
                    {
                        fieldLabel: "A",
                        margin: '0 0 0 100'
                    },
                    {
                        fieldLabel: "B"
                    },
                    {
                        fieldLabel: "C",
                        margin: '0 0 0 100'

                    },
                    {
                        fieldLabel: "D"
                    },
                    {
                        fieldLabel: "E",
                        margin: '0 0 0 100'
                    },
                    {
                        fieldLabel: "F"
                    }
                ]
            },
            {
                name: 'transform',
                xtype: 'uxfieldset',
                itemId: 'transform',
                title: resource['transform'],
                legendItemConfig: {
                    disabledBtn: {
                        isUsable: false,
                        hidden: false,
                        disabled: false,
                    },
                    tipInfoBtn: {
                        hidden: false,
                        disabled: false,
                        tooltip: 'A 水平缩放 ' +
                            'B 水平拉伸<br>' +
                            'C 垂直拉伸 ' +
                            'D 垂直缩放<br>' +
                            'E 水平位移 ' +
                            'F 垂直位移'
                    }
                },
                layout: {
                    type: 'table',
                    columns: 2
                },
                diyGetValue: function () {
                    var me = this;
                    if (me.legend.getComponent('disabledBtn').isUsable == false) {
                        return null;
                    } else {
                        var result = [];
                        for (var i = 0; i < me.items.items.length; i++) {
                            result.push(me.items.items[i].getValue());
                        }
                        return result;
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    me.suspendLayouts();
                    var disabledBtn = me.legend.getComponent('disabledBtn');
                    if (data) {
                        for (var i = 0; i < me.items.items.length; i++) {
                            me.items.items[i].setValue(data[i]);
                        }
                        disabledBtn.count = 1;
                        disabledBtn.handler();
                    } else {
                        disabledBtn.count = 0;
                        disabledBtn.handler();
                    }
                    me.resumeLayouts();
                    me.updateLayout();
                },
                defaults: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    labelWidth: 50,
                    decimalPrecision: 4,
                    labelAlign: 'right',
                    flex: 1
                },
                items: [
                    {
                        fieldLabel: "A",
                        margin: '0 0 0 100',
                    },
                    {
                        fieldLabel: "B",
                    },
                    {
                        fieldLabel: "C",
                        margin: '0 0 0 100',
                    },
                    {
                        fieldLabel: "D",
                    },
                    {
                        fieldLabel: "E",
                        margin: '0 0 0 100',
                    },
                    {
                        fieldLabel: "F",
                    }
                ]
            },
            {
                xtype: 'textfield',
                name: 'originalFileName',
                itemId: 'originalFileName',
                fieldLabel: resource['oringinal FileName']
            },
            {
                xtype: 'textfield',
                name: 'templateConfigGroupId',
                itemId: 'templateConfigGroupId',
                fieldLabel: resource['templateConfig GroupId']
            },
            {
                xtype: 'tspanfieldset',
                name: 'placeholder',
                itemId: 'placeholder',
                title: resource['placeholder']
            },
            {
                xtype: 'numberfield',
                name: 'imageWidth',
                itemId: 'imageWidth',
                fieldLabel: resource['imageWidth'],
                emptyText: 'width，height向上取整',
                submitEmptyText: false
            },
            {
                xtype: 'numberfield',
                name: 'imageHeight',
                itemId: 'imageHeight',
                fieldLabel: resource['imageHeight'],
                emptyText: 'width，height向上取整',
                submitEmptyText: false
            },
            {
                xtype: 'shapeconfigfieldset',
                name: 'shape',
                itemId: 'shape',
                title: resource['shape'],
                legendItemConfig: {
                    disabledBtn: {
                        isUsable: true,
                        hidden: true,
                        disabled: false,
                    }
                },
            },
            {
                xtype: 'uxfieldset',
                name: 'fillStyle',
                itemId: 'fillStyle',
                title: resource['fillStyle'],
                defaults: {
                    allowBlank: true,
                    width: '100%'
                },
                legendItemConfig: {
                    disabledBtn: {
                        isUsable: false,
                        hidden: false,
                        disabled: false,
                    }
                },
                mapping: {
                    'common': [],
                    'SolidColor': [
                        'color', 'alpha'
                    ],
                    'BitmapFill': [
                        'alpha', 'fillMode', 'matrix', 'rotation', 'scaleX', 'scaleY', 'smooth', 'source', 'transformX', 'transformY', 'x', 'y']
                },
                diyGetValue: function () {
                    var me = this;
                    if (me.legend.getComponent('disabledBtn').isUsable == false) {
                        return null;
                    } else {
                        return me.getValue();
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    me.suspendLayouts();
                    var disabledBtn = me.legend.getComponent('disabledBtn');
                    if (data) {
                        me.setValue(data);
                        disabledBtn.count = 1;
                        disabledBtn.handler();
                    } else {
                        disabledBtn.count = 0;
                        disabledBtn.handler();

                    }
                    me.resumeLayouts();
                    me.updateLayout();
                },
                items: [
                    {
                        xtype: 'combo',
                        fieldLabel: resource['clazz'],
                        itemId: 'clazz',
                        name: 'clazz',
                        editable: false,
                        readOnly: true,
                        valueField: 'value',
                        displayField: 'display',
                        value: 'SolidColor',
                        store: {
                            xtype: 'store',
                            fields: ['value', 'display'],
                            data: [
                                {
                                    value: 'SolidColor',
                                    display: 'SolidColor'
                                },
                                {
                                    value: 'BitmapFill',
                                    display: 'BitmapFill'
                                }
                            ]
                        },
                        listeners: {
                            change: function (combo, newValue, oldValue) {
                                var fieldSet = combo.ownerCt;
                                for (var i = 0; i < fieldSet.items.items.length; i++) {
                                    var item = fieldSet.items.items[i];
                                    if (Ext.Array.contains(mapping['common'], item.itemId)) {

                                    } else if (Ext.Array.contains(mapping[newValue], item.itemId)) {
                                        item.show();
                                        item.setDisabled(false);
                                    } else {
                                        item.hide();
                                        item.setDisabled(true);
                                    }
                                }
                            }
                        }
                    },
                    /*     {
                             //这个颜色他们要10进制表示
                             xtype: 'numberfield',
                             fieldLabel: resource['color'] + '(十进制值)',
                             itemId: 'color',
                             maxValue: 255255255,
                             minValue: 0,
                             name: 'color',
                             tipInfo: '十进制的颜色值'
                         },
     */
                    {
                        xtype: 'gridcombo',
                        name: 'color',
                        itemId: 'color',
                        fieldLabel: resource['color'] + '(十进制值)',
                        valueField: 'displayCode2',
                        displayField: 'displayCode2',
                        store: colorStore,
                        matchFieldWidth: false,
                        haveReset: true,
                        filterCfg: {
                            height: 80,
                            layout: {
                                type: 'column',
                                columns: 3
                            },
                            items: [
                                {
                                    name: '_id',
                                    xtype: 'textfield',
                                    hideTrigger: true,
                                    isLike: false,
                                    allowDecimals: false,
                                    width: 250,
                                    fieldLabel: resource['id'],
                                    itemId: '_id'
                                }, {
                                    name: 'colorName',
                                    xtype: 'textfield',
                                    hideTrigger: true,
                                    isLike: false,
                                    margin: 0,
                                    width: 250,
                                    allowDecimals: false,
                                    fieldLabel: resource['color'] + resource['name'],
                                    itemId: 'colorName'
                                },
                                {
                                    name: 'displayCode',
                                    xtype: 'textfield',
                                    isLike: false,
                                    width: 250,
                                    emptyText: resource['10进制代码'],
                                    fieldLabel: resource['color'] + resource['code'],
                                    itemId: 'displayCode2',
                                    diyGetValue: function () {
                                        var me = this;
                                        var data = me.getValue();//10进制值
                                        if (!Ext.isEmpty(data)) {
                                            var hexData = Number(data).toString(16)
                                            return hexData;
                                        } else {
                                            return null;
                                        }
                                    }
                                }
                            ]
                        },
                        autoQuery: false,
                        gridCfg: {
                            width: 800,
                            height: 450,
                            columns: [
                                {
                                    text: resource['id'],
                                    dataIndex: '_id',
                                    itemId: '_id',
                                }, {
                                    text: resource['color'] + resource['name'],
                                    dataIndex: 'colorName',
                                    itemId: 'colorName',
                                    width: 110,
                                },
                                {
                                    text: resource['color'] + resource['code'] + '(16进制)',
                                    dataIndex: 'displayCode',
                                    itemId: 'displayCode',
                                    width: 150,
                                },
                                {
                                    text: resource['color'] + resource['code'] + '(10进制)',
                                    dataIndex: 'displayCode2',
                                    itemId: 'displayCode2',
                                    width: 150,
                                }, {
                                    text: resource['value'],
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
                                    text: resource['显示颜色'],
                                    itemId: 'color',
                                    dataIndex: 'color',
                                    minWidth: 100,
                                    flex: 1,
                                }
                            ],
                            bbar: {
                                xtype: 'pagingtoolbar',
                                store: colorStore,
                                displayInfo: true,
                                displayMsg: '',
                                emptyMsg: resource['noData']
                            }
                        },
                        editable: true,
                        autoSelect: false,
                        forceSelection: false,
                        queryParam: '',
                        queryMode: 'local',
                        tipInfo: '输入的数据为十进制的颜色值',
                        diySetValue: function (data) {
                            var me = this;
                            me.setValue({
                                displayCode2: data
                            });
                        },
                        diyGetValue: function () {
                            var me = this;
                            return me.getRawValue();
                        }
                    },

                    {
                        xtype: 'numberfield',
                        fieldLabel: resource['alpha'],
                        itemId: 'alpha',
                        name: 'alpha',
                        tipInfo: '值必须是介于 0.0(完全透明) 与 1.0(不透明)之间的数字',
                        value: 1,
                        decimalPrecision: 1,
                        allowDecimals: true,
                        maxValue: 1,
                        minValue: 0
                    },
                ],
            },
            {
                xtype: 'uxfieldset',
                name: 'strokeStyle',
                itemId: 'strokeStyle',
                title: resource['strokeStyle'],
                legendItemConfig: {
                    disabledBtn: {
                        isUsable: false,
                        hidden: false,
                        disabled: false,
                    }
                },
                defaults: {
                    allowBlank: true,
                    width: '100%'
                },
                diyGetValue: function () {
                    var me = this;
                    if (me.legend.getComponent('disabledBtn').isUsable == false) {
                        return null;
                    } else {
                        return me.getValue();
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    me.suspendLayouts();
                    var disabledBtn = me.legend.getComponent('disabledBtn');
                    if (data) {
                        me.setValue(data);
                        disabledBtn.count = 1;
                        disabledBtn.handler();
                    } else {
                        disabledBtn.count = 0;
                        disabledBtn.handler();

                    }
                    me.resumeLayouts();
                    me.updateLayout();
                },
                items: [
                    {
                        xtype: 'combo',
                        fieldLabel: resource['clazz'],
                        itemId: 'clazz',
                        name: 'clazz',
                        editable: false,
                        readOnly: true,
                        valueField: 'value',
                        displayField: 'display',
                        value: 'SolidColor',
                        store: {
                            xtype: 'store',
                            fields: ['value', 'display'],
                            data: [
                                {
                                    value: 'SolidColor',
                                    display: 'SolidColor'
                                },
                                {
                                    value: 'BitmapFill',
                                    display: 'BitmapFill'
                                },
                            ]
                        }
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: resource['color'],
                        itemId: 'color',
                        name: 'color',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: resource['width'],
                        itemId: 'width',
                        name: 'width',
                        minValue: 0
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: resource['alpha'],
                        itemId: 'alpha',
                        name: 'alpha',
                        minValue: 0
                    }, {
                        xtype: 'textfield',
                        fieldLabel: resource['caps'],
                        itemId: 'caps',
                        name: 'caps',
                    }, {
                        xtype: 'textfield',
                        fieldLabel: resource['joints'],
                        itemId: 'joints',
                        name: 'joints',
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: resource['miterLimit'],
                        itemId: 'miterLimit',
                        name: 'miterLimit',
                    }
                ]
            },
            {
                xtype: 'combo',
                itemId: 'horizontalAlign',
                name: 'horizontalAlign',
                editable: false,
                haveReset: true,
                fieldLabel: resource['horizontalAlign'],
                valueField: 'value',
                displayField: 'display',
                store: {
                    xtype: 'store',
                    fields: ['value', 'display'],
                    data: [
                        {
                            value: 'Left',
                            display: 'Left'
                        },
                        {
                            value: 'Center',
                            display: 'Center'
                        },
                        {
                            value: 'Right',
                            display: 'Right'
                        }
                    ]
                },
            },
            {
                xtype: 'combo',
                itemId: 'verticalAlign',
                name: 'verticalAlign',
                editable: false,
                haveReset: true,
                fieldLabel: resource['verticalAlign'],
                valueField: 'value',
                displayField: 'display',
                store: {
                    xtype: 'store',
                    fields: ['value', 'display'],
                    data: [
                        {
                            value: 'Top',
                            display: 'Top'
                        },
                        {
                            value: 'Center',
                            display: 'Center'
                        },
                        {
                            value: 'Bottom',
                            display: 'Bottom'
                        }
                    ]
                },
            }

        ];
        return components;
    },
    initComponent: function () {
        var me = this;
        me.colorStore = Ext.data.StoreManager.get('colorStore') || Ext.create('CGP.color.store.ColorStore', {
            storeId: 'colorStore',
            model: 'CGP.pagecontentschema.view.pagecontentitemplaceholders.model.ColorModel',
            params: {
                filter: Ext.JSON.encode([{
                    name: 'clazz',
                    type: 'string',
                    value: 'com.qpp.cgp.domain.common.color.RgbColor'
                }])
            }
        });
        me.items = me.buildItems();
        me.callParent();
    },
})

