/**
 * Created by nan on 2021/9/28
 */
Ext.Loader.setPath({
    "CGP.virtualcotainerobject": path + 'partials/virtualcotainerobject/app'
});
Ext.Loader.setPath({
    "CGP.resource": path + 'partials/resource/app'
});
Ext.Loader.syncRequire([
    'CGP.resource.store.CompositeDisplayObject',
    'CGP.pcresourcelibrary.store.ResourceStore',
    'CGP.virtualcontainertype.view.DiyFieldSet',
    'CGP.virtualcontainertype.model.VirtualContainerTypeModel',
    'CGP.common.field.RtTypeSelectField'
])
Ext.define('CGP.virtualcontainertype.view.CustomDataForm', {
    extend: "Ext.ux.form.ErrorStrickForm",
    alias: 'widget.customdataform',
    border: false,
    autoScroll: true,
    record: null,
    defaults: {
        margin: '5 25 10 50',
        width: 450
    },
    isValidForItems: true,
    getValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.diyGetValue) {
                result[item.getName()] = item.diyGetValue();
            } else if (item.getValue) {
                result[item.getName()] = item.getValue();
            }

        }
        return result;
    },
    initComponent: function () {
        var me = this;
        me.controller = Ext.create('CGP.virtualcontainertype.controller.Controller');
        var rtTypeStore = Ext.create('CGP.material.store.RtType');
        var compositeDisplayObject = Ext.create('CGP.resource.store.CompositeDisplayObject');
        var containerObjectStore = Ext.create('CGP.virtualcontainertype.store.VirtualContainerObjectStore')
        var ResourceStore = Ext.create('CGP.pcresourcelibrary.store.ResourceStore', {
            autoLoad: false,
        });
        me.items = [
            {
                xtype: 'toolbar',
                border: '0 0 1 0',
                margin: 0,
                width: '100%',
                getName: Ext.emptyFn,
                getValue: Ext.emptyFn,
                setValue: Ext.emptyFn,
                items: [
                    {
                        xtype: 'displayfield',
                        value: '<font color="green" style="font-weight: bold" >' + i18n.getKey('baseInfo') + '</font>',
                    }
                ],
                isValid: function () {
                    return true;
                },
                getName: Ext.emptyFn,
                getValue: Ext.emptyFn,
                setValue: Ext.emptyFn,
            },
            {
                xtype: 'textfield',
                name: '_id',
                itemId: '_id',
                allowBlank: true,
                hidden: true,
                fieldLabel: i18n.getKey('_id')
            },
            {
                xtype: 'textfield',
                name: 'clazz',
                itemId: 'clazz',
                allowBlank: true,
                hidden: true,
                value: 'com.qpp.cgp.domain.pcresource.virtualcontainer.VirtualContainerType'
            },
            {
                xtype: 'textfield',
                name: 'description',
                allowBlank: false,
                itemId: 'description',
                fieldLabel: i18n.getKey('description')
            },
            {
                xtype: 'gridcombo',
                name: 'template',
                itemId: 'template',
                id: 'template',
                allowBlank: false,
                fieldLabel: i18n.getKey('templateElement'),
                displayField: 'name',
                valueField: '_id',
                autoScroll: true,
                editable: false,
                store: compositeDisplayObject,
                matchFieldWidth: false,
                multiSelect: false,
                gridCfg: {
                    height: 400,
                    width: 700,
                    //hideHeaders : true,
                    columns: [
                        {
                            xtype: 'rownumberer'
                        },
                        {
                            text: i18n.getKey('id'),
                            dataIndex: '_id'
                        },
                        {
                            text: i18n.getKey('name'),
                            width: 200,
                            dataIndex: 'name',
                            renderer: function (value, metadata) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('description'),
                            width: 200,
                            dataIndex: 'description',
                            renderer: function (value, metadata) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('width') + i18n.getKey('height'),
                            dataIndex: 'sourceContainerWidth',
                            xtype: 'gridcolumn',
                            flex: 1,
                            renderer: function (value, metadata, record) {
                                var result = '宽:' + value + ' , ';
                                result += '高:' + record.get('sourceContainerHeight')
                                metadata.tdAttr = 'data-qtip="' + result + '"';
                                return result;
                            }
                        }
                    ],
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: compositeDisplayObject,
                    }
                },
                valueType: 'idReference',
                haveReset: true,
                diyGetValue: function () {
                    return this.getArrayValue();
                },
                diySetValue: function (data) {
                    if (data) {
                        this.setInitialValue([data._id]);
                    }
                },
                gotoConfigHandler: function () {
                   
                    var modelId = this.getSubmitValue()[0];
                    JSOpen({
                        id: 'compositeDisplayObject',
                        url: path + 'partials/resource/app/view/compositeDisplayObject/main.html?_id=' + modelId,
                        title: i18n.getKey('compositeDisplayObject'),
                        refresh: true,
                    })
                },
                listeners: {
                    change: function (gridCombo, newValue, oldValue) {
                        var placeHolder = gridCombo.ownerCt.getComponent('virtualContainerPlaceholders');
                        placeHolder.items.items[0].setDisabled(Ext.Object.isEmpty(newValue));
                        var subVirtualContainerObjects = gridCombo.ownerCt.getComponent('subVirtualContainerObjects');
                        subVirtualContainerObjects.items.items[0].setDisabled(Ext.Object.isEmpty(newValue));
                    }
                }
            },
            {
                xtype: 'rttypeselectfield',
                name: 'argumentType',
                itemId: 'argumentType',
                fieldLabel: i18n.getKey('argumentType'),
                matchFieldWidth: true,
                allowBlank: false,
                width: 450,
                diyGetValue: function () {
                    var me = this;
                    return {
                        _id: me.getValue(),
                        clazz: "com.qpp.cgp.domain.bom.attribute.RtType"
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    me.setInitialValue([data._id]);
                },
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var form = field.ownerCt;
                        var controller = form.controller;
                        var contentData = controller.buildContentData(newValue);
                        var contentAttributeStore = Ext.data.StoreManager.get('contentAttributeStore');
                        contentAttributeStore.proxy.data = contentData;
                        contentAttributeStore.load();
                    }
                }
            },
            {
                xtype: 'valueexfield',
                name: 'compile',
                itemId: 'compile',
                allowBlank: true,
                fieldLabel: i18n.getKey('编译'),
                tipInfo: '后台通过该配置对生成配置进一步处理',
                diyGetValue: function () {
                    var data = this.getValue();
                    if (data) {
                        return {
                            valueEx: data,
                            clazz: 'com.qpp.cgp.domain.pcresource.virtualcontainer.UserDefineCompile'
                        }
                    }
                },
                diySetValue: function (data) {
                    if (data) {
                        this.setValue(data.valueEx);
                    }
                }
            },
            {
                xtype: 'diyfieldset',
                title: "<font style= 'font-size:15px;color:green;font-weight: bold'>" + i18n.getKey('子VCT占位符') + '</font>',
                itemId: 'virtualContainerContents',
                name: 'virtualContainerContents',
                margin: 0,
                width: '100%',
                items: [{
                    margin: '5 25 10 50',
                    xtype: 'gridfieldwithcrudv2',
                    name: 'virtualContainerContents',
                    itemId: 'virtualContainerContents',
                    fieldLabel: i18n.getKey('virtualContainerContents'),
                    labelStyle: "display:none",
                    labelAlign: 'top',
                    minHeight: 100,
                    width: 900,
                    gridConfig: {
                        store: {
                            xtype: 'store',
                            fields: [
                                'selector',
                                'name',
                                'replace',
                                'required',
                                'clazz'
                            ],
                            data: []
                        },
                        columns: [
                            {
                                dataIndex: 'selector',
                                width: 300,
                                text: i18n.getKey('selector'),
                                renderer: function (value, mateData, record) {
                                    return value;
                                }
                            },
                            {
                                dataIndex: 'name',
                                width: 300,
                                text: i18n.getKey('name'),
                            },
                            {
                                dataIndex: 'replace',
                                flex: 1,
                                text: i18n.getKey('replace'),
                            },
                            {
                                dataIndex: 'required',
                                flex: 1,
                                text: i18n.getKey('required'),
                            },
                        ],
                    },
                    winConfig: {
                        formConfig: {
                            defaults: {
                                width: 450,
                                colspan: 2,
                            },
                            layout: {
                                type: 'table',
                                margin: '5 25 5 25',
                                columns: 2
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: i18n.getKey('name'),
                                    itemId: 'name',
                                    name: 'name',
                                    tipInfo: '用于在VCO中查找相同名称的配置'
                                },
                                {
                                    xtype: 'jsonpathselector',
                                    itemId: 'selector',
                                    fieldLabel: i18n.getKey('selector'),
                                    name: 'selector',
                                    listeners: {
                                        afterrender: function () {
                                            var me = this;
                                            var data = Ext.getCmp('template').getValue();
                                            var treeData = Object.values(data)[0];
                                            treeData = JSJsonToTree(treeData, 'template');
                                            me.store = Ext.create('Ext.data.TreeStore', {
                                                autoLoad: true,
                                                fields: [
                                                    'text', 'value'
                                                ],
                                                proxy: {
                                                    type: 'memory'
                                                },
                                                root: {
                                                    expanded: true,
                                                    children: treeData
                                                }
                                            })
                                        }
                                    }
                                },
                                {
                                    xtype: 'checkbox',
                                    fieldLabel: i18n.getKey('replace'),
                                    itemId: 'replace',
                                    name: 'replace',
                                    width: 150,
                                    colspan: 1,
                                    tipInfo: '勾选表示替换指定选择器的值,反之表示插入值'
                                },
                                {
                                    xtype: 'checkbox',
                                    fieldLabel: i18n.getKey('required'),
                                    itemId: 'required',
                                    width: 150,
                                    name: 'required',
                                    colspan: 1,
                                    tipInfo: '勾选表示使用该配置时,必须有对应VTO配置'
                                },
                            ]
                        }
                    },
                }]
            },
            {
                xtype: 'diyfieldset',
                title: "<font style= 'font-size:15px;color:green;font-weight: bold'>" + i18n.getKey('固定的VCO占位符') + '</font>',
                itemId: 'subVirtualContainerObjects',
                name: 'subVirtualContainerObjects',
                margin: 0,
                width: '100%',
                items: [
                    {
                        margin: '5 25 10 50',
                        xtype: 'gridfieldwithcrudv2',
                        name: 'subVirtualContainerObjects',
                        itemId: 'subVirtualContainerObjects',
                        fieldLabel: i18n.getKey('subVirtualContainerObjects'),
                        labelStyle: "display:none",
                        labelAlign: 'top',
                        minHeight: 100,
                        width: 700,
                        gridConfig: {
                            disabled: true,
                            store: {
                                xtype: 'store',
                                fields: [
                                    'selector',
                                    {
                                        name: 'containerObject',
                                        type: 'object'
                                    },
                                    'replace',
                                ]
                            },
                            columns: [
                                {
                                    dataIndex: 'selector',
                                    width: 350,
                                    text: i18n.getKey('selector'),
                                    renderer: function (value, mateData, record) {
                                        return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value + '</div>'
                                    }
                                },
                                {
                                    xtype: 'componentcolumn',
                                    dataIndex: 'containerObject',
                                    flex: 1,
                                    text: i18n.getKey('VCO'),
                                    renderer: function (value, metadata, record) {
                                        metadata.tdAttr = 'data-qtip="查看"';
                                        return {
                                            xtype: 'displayfield',
                                            value: '<a href="#")>' + value._id + '</a>',
                                            listeners: {
                                                render: function (display) {
                                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                    ela.on("click", function () {
                                                        JSOpen({
                                                            id: 'VTO',
                                                            url: path,
                                                            title: '',
                                                            refresh: true
                                                        })
                                                    });
                                                }
                                            }
                                        };
                                    }
                                },
                                {
                                    dataIndex: 'replace',
                                    flex: 1,
                                    text: i18n.getKey('replace'),
                                },
                            ],
                        },
                        winConfig: {
                            formConfig: {
                                defaults: {
                                    width: 450
                                },
                                items: [
                                    {
                                        xtype: 'jsonpathselector',
                                        itemId: 'selector',
                                        fieldLabel: i18n.getKey('selector'),
                                        name: 'selector',
                                        listeners: {
                                            afterrender: function () {
                                                var me = this;
                                                var data = Ext.getCmp('template').getValue();
                                                var treeData = Object.values(data)[0];
                                                treeData = JSJsonToTree(treeData, 'template');
                                                me.store = Ext.create('Ext.data.TreeStore', {
                                                    autoLoad: true,
                                                    fields: [
                                                        'text', 'value'
                                                    ],
                                                    proxy: {
                                                        type: 'memory'
                                                    },
                                                    root: {
                                                        expanded: true,
                                                        children: treeData
                                                    }
                                                })
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'gridcombo',
                                        fieldLabel: i18n.getKey('VCO'),
                                        allowBlank: false,
                                        displayField: 'diyDisplay',
                                        valueField: '_id',
                                        autoScroll: true,
                                        editable: false,
                                        name: 'containerObject',
                                        itemId: 'containerObject',
                                        store: containerObjectStore,
                                        matchFieldWidth: false,
                                        multiSelect: false,
                                        gridCfg: {
                                            height: 200,
                                            width: 500,
                                            columns: [
                                                {
                                                    text: i18n.getKey('id'),
                                                    width: 100,
                                                    dataIndex: '_id'
                                                },
                                                {
                                                    text: i18n.getKey('description'),
                                                    flex: 1,
                                                    dataIndex: 'description',
                                                    renderer: function (value, metadata) {
                                                        metadata.tdAttr = 'data-qtip="' + value + '"';
                                                        return value;
                                                    }
                                                }
                                            ],
                                            bbar: {
                                                xtype: 'pagingtoolbar',
                                                store: containerObjectStore
                                            }
                                        },
                                        valueType: 'idReference',
                                        diySetValue: function (data) {
                                            var me = this;
                                            if (data) {
                                                me.setInitialValue([data._id]);
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'checkbox',
                                        fieldLabel: i18n.getKey('replace'),
                                        itemId: 'replace',
                                        name: 'replace',
                                    },
                                ]
                            }
                        },
                    },
                ]
            },
            {
                xtype: 'diyfieldset',
                title: "<font style= 'font-size:15px;color:green;font-weight: bold'>" + i18n.getKey('普通占位符') + '</font>',
                itemId: 'virtualContainerPlaceholders',
                name: 'virtualContainerPlaceholders',
                margin: 0,
                width: '100%',
                items: [
                    {
                        margin: '5 25 10 50',
                        xtype: 'gridfieldwithcrudv2',
                        name: 'virtualContainerPlaceholders',
                        itemId: 'virtualContainerPlaceholders',
                        fieldLabel: i18n.getKey('virtualContainerPlaceholders'),
                        labelStyle: "display:none",
                        labelAlign: 'top',
                        minHeight: 100,
                        width: 700,
                        gridConfig: {
                            disabled: true,
                            store: {
                                xtype: 'store',
                                fields: [
                                    'selector',
                                    'clazz',
                                    {
                                        name: 'value',
                                        type: 'object'
                                    }
                                ]
                            },
                            columns: [
                                {
                                    dataIndex: 'selector',
                                    width: 350,
                                    text: i18n.getKey('itemSelector'),
                                    renderer: function (value, mateData, record) {
                                        return value;
                                    }
                                },
                                {
                                    xtype: 'componentcolumn',
                                    dataIndex: 'value',
                                    flex: 1,
                                    text: i18n.getKey('value'),
                                    renderer: function (value, mateData, record) {
                                        if (value.clazz == 'com.qpp.cgp.domain.pcresource.virtualcontainer.ExpressionValue') {
                                            var text = '查看';
                                            if (value.valueEx.clazz == 'com.qpp.cgp.value.ConstantValue') {
                                                text = value.valueEx.value;
                                            }
                                            return {
                                                xtype: 'button',
                                                text: text,
                                                value: value.valueEx,
                                                cls: 'a-btn',
                                                itemId: 'diyConditionExpression',
                                                border: false,
                                                handler: function (button) {
                                                    var valueEx = Ext.create('CGP.common.valueExV3.GroupGridTab', {
                                                        readOnly: true,
                                                        listeners: {
                                                            'afterrender': function (view) {
                                                                if (!Ext.Object.isEmpty(button.value)) {//不为一个空对象
                                                                    view.getGridPanel().setValue(button.value.constraints);
                                                                    view.getFormPanel().setValue(button.value);
                                                                } else {
                                                                    view.getGridPanel().setValue({});
                                                                }
                                                            }
                                                        }
                                                    });
                                                    var win = Ext.create('Ext.window.Window', {
                                                        modal: true,
                                                        constrain: true,
                                                        maximizable: true,
                                                        editButton: button,
                                                        layout: 'fit',
                                                        width: '60%',
                                                        height: '70%',
                                                        title: i18n.getKey('check'),
                                                        items: [valueEx],
                                                    })
                                                    win.show();
                                                }
                                            }
                                        } else if (value.clazz == 'com.qpp.cgp.domain.pcresource.virtualcontainer.ResourceValue') {
                                            return JSCreateHTMLTable([
                                                {
                                                    title: i18n.getKey('id'),
                                                    value: value.resource._id
                                                },
                                                {
                                                    title: i18n.getKey('resources') + i18n.getKey('type'),
                                                    value: value.resource.clazz.split('.').pop()
                                                },
                                                {
                                                    title: i18n.getKey('name'),
                                                    value: value.resource.name
                                                }
                                            ])
                                        }
                                    }
                                }
                            ],
                        },
                        winConfig: {
                            winTitle: i18n.getKey('placeHolder'),
                            formConfig: {
                                defaults: {
                                    width: 450
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        itemId: 'clazz',
                                        name: 'clazz',
                                        hidden: true,
                                        value: 'com.qpp.cgp.domain.pcresource.virtualcontainer.VirtualContainerPlaceholder'
                                    },
                                    {
                                        xtype: 'jsonpathselector',
                                        itemId: 'selector',
                                        fieldLabel: i18n.getKey('selector'),
                                        name: 'selector',
                                        listeners: {
                                            afterrender: function () {
                                                var me = this;
                                                var data = Ext.getCmp('template').getValue();
                                                var treeData = Object.values(data)[0];
                                                treeData = JSJsonToTree(treeData, 'template');
                                                me.store = Ext.create('Ext.data.TreeStore', {
                                                    autoLoad: true,
                                                    fields: [
                                                        'text', 'value'
                                                    ],
                                                    proxy: {
                                                        type: 'memory'
                                                    },
                                                    root: {
                                                        expanded: true,
                                                        children: treeData
                                                    }
                                                })
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'uxfieldcontainer',
                                        itemId: 'value',
                                        fieldLabel: i18n.getKey('value'),
                                        name: 'value',
                                        defaults: {
                                            labelWidth: 50,
                                            width: 400,
                                            margin: '10 0 10 50',
                                            allowBlank: false
                                        },
                                        items: [
                                            {
                                                xtype: 'combo',
                                                name: 'clazz',
                                                itemId: 'clazz',
                                                fieldLabel: i18n.getKey('type'),
                                                allowBlank: false,
                                                editable: false,
                                                displayField: 'display',
                                                valueField: 'value',
                                                value: 'com.qpp.cgp.domain.pcresource.virtualcontainer.ResourceValue',
                                                store: {
                                                    xtype: 'store',
                                                    fields: ['value', 'display'],
                                                    data: [
                                                        {
                                                            value: 'com.qpp.cgp.domain.pcresource.virtualcontainer.ExpressionValue',
                                                            display: 'ExpressionValue'
                                                        },
                                                        {
                                                            value: 'com.qpp.cgp.domain.pcresource.virtualcontainer.ResourceValue',
                                                            display: 'ResourceValue'
                                                        }
                                                    ]
                                                },
                                                listeners: {
                                                    change: function (combo, newValue, oldValue) {
                                                        var valueEx = combo.ownerCt.getComponent('valueEx');
                                                        var resource = combo.ownerCt.getComponent('resource');
                                                        if (newValue == 'com.qpp.cgp.domain.pcresource.virtualcontainer.ExpressionValue') {
                                                            valueEx.show();
                                                            valueEx.setDisabled(false);
                                                            resource.hide();
                                                            resource.setDisabled(true);
                                                        } else {
                                                            resource.show();
                                                            resource.setDisabled(false);
                                                            valueEx.hide();
                                                            valueEx.setDisabled(true);
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                xtype: 'valueexfield',
                                                name: 'valueEx',
                                                itemId: 'valueEx',
                                                hidden: true,
                                                disabled: true,
                                                fieldLabel: i18n.getKey('valueEx'),
                                            },
                                            {
                                                xtype: 'gridcombo',
                                                name: 'resource',
                                                itemId: 'resource',
                                                allowBlank: false,
                                                fieldLabel: i18n.getKey('resources'),
                                                displayField: 'name',
                                                valueField: '_id',
                                                autoScroll: true,
                                                editable: false,
                                                store: ResourceStore,
                                                matchFieldWidth: false,
                                                multiSelect: false,
                                                filterCfg: {
                                                    height: 80,
                                                    layout: {
                                                        type: 'column',
                                                        columns: 2
                                                    },
                                                    items: [
                                                        {
                                                            name: '_id',
                                                            xtype: 'textfield',
                                                            isLike: false,
                                                            fieldLabel: i18n.getKey('id'),
                                                            itemId: 'id'
                                                        },
                                                        {
                                                            name: 'clazz',
                                                            xtype: 'combo',
                                                            fieldLabel: i18n.getKey('clazz'),
                                                            itemId: 'clazz',
                                                            displayField: 'display',
                                                            valueField: 'value',
                                                            editable: false,
                                                            isLike: false,
                                                            value: 'com.qpp.cgp.domain.pcresource.Image',
                                                            store: {
                                                                xtype: 'store',
                                                                fields: ['value', 'display'],
                                                                data: [
                                                                    {
                                                                        display: 'CMYKColor',
                                                                        value: 'com.qpp.cgp.domain.pcresource.color.CMYKColor',
                                                                    },
                                                                    {
                                                                        display: 'RGBColor',
                                                                        value: 'com.qpp.cgp.domain.pcresource.color.RGBColor',

                                                                    },
                                                                    {
                                                                        display: 'SpotColor',
                                                                        value: 'com.qpp.cgp.domain.pcresource.color.SpotColor',
                                                                    },
                                                                    {
                                                                        display: 'Font',
                                                                        value: 'com.qpp.cgp.domain.pcresource.font.Font',
                                                                    },
                                                                    {
                                                                        display: 'Image',
                                                                        value: 'com.qpp.cgp.domain.pcresource.Image',
                                                                    },
                                                                ]
                                                            },
                                                        }
                                                    ]
                                                },
                                                gridCfg: {
                                                    height: 400,
                                                    width: 700,
                                                    columns: [
                                                        {
                                                            xtype: 'rownumberer'
                                                        },
                                                        {
                                                            dataIndex: '_id',
                                                            text: i18n.getKey('id'),
                                                        },
                                                        {
                                                            dataIndex: 'name',
                                                            flex: 2,
                                                            text: i18n.getKey('name')
                                                        },
                                                        {
                                                            dataIndex: 'description',
                                                            text: i18n.getKey('description'),
                                                            flex: 2
                                                        },
                                                        {
                                                            dataIndex: 'clazz',
                                                            text: i18n.getKey('type'),
                                                            flex: 1,
                                                            renderer: function (value, mateData, record) {
                                                                return value.split('.').pop();
                                                            }
                                                        }
                                                    ],
                                                    tbar: [],
                                                    bbar: {
                                                        xtype: 'pagingtoolbar',
                                                        store: ResourceStore
                                                    }
                                                },
                                            }
                                        ]
                                    },
                                ]
                            }
                        },
                    },
                ]
            },
            {
                xtype: 'scopefunfield',
                width: '100%',
                name: 'scopeFunc',
                itemId: 'scopeFunc',
                margin: '5 0 10 0',
            },
        ];
        me.callParent();
    },
    listeners: {
        afterrender: function () {
            var me = this;
            if (me.record) {
                me.setValue(me.record.getData());
            }
        }
    }
})