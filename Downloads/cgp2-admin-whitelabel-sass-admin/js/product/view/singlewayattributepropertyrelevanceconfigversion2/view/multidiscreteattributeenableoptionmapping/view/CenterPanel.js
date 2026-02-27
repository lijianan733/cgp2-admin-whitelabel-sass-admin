/**
 * Created by nan on 2019/11/22.
 */
Ext.Loader.syncRequire(['' +
    'Ext.ux.form.field.MultiCombo',
    'Ext.ux.data.proxy.PagingMemoryProxy'
]);
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.view.CenterPanel', {
    extend: 'Ext.form.Panel',
    region: 'center',
    autoScroll: true,
    itemId: 'centerPanel',
    bodyPadding: 20,
    attributeArray: [],
    recordData: [],
    defaults: {
        width: 450
    },
    productId: null,
    skuAttributeStore: null,
    OptionSkuAttributeStore: null,
    skuAttributeIds: null,
    createOrEdit: 'create',
    depends: null,
    inputTypeProperty: [//选项类型的可用操作符
        {
            value: 'Value',
            display: 'Value'
        },
        {
            value: 'Enable',
            display: 'Enable'
        },
        {
            value: 'Hidden',
            display: 'Hidden'
        },
        {
            value: 'Required',
            display: 'Required'
        },
        {
            value: 'OriginalValue',
            display: 'OriginalValue'
        },
        {
            value: 'OriginalEnable',
            display: 'OriginalEnable'
        },
        {
            value: 'OriginalHidden',
            display: 'OriginalHidden'
        },
        {
            value: 'OriginalRequire',
            display: 'OriginalRequire'
        }, {
            value: 'ReadOnly',
            display: 'ReadOnly'
        }
    ],
    optionTypeProperty: [//离散输入型的可用操作符
        {
            value: 'EnableOption',
            display: 'EnableOption'
        },
        {
            value: 'HiddenOption',
            display: 'HiddenOption'
        },
        {
            value: 'OriginalEnableOption',
            display: 'OriginalEnableOption'
        },
        {
            value: 'OriginalHiddenOption',
            display: 'OriginalHiddenOption'
        }
    ],
    controller: Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.controller.Controller'),
    initComponent: function () {
        var me = this;
        //定义一个校验，选择的数量必须大于1
        Ext.apply(Ext.form.VTypes, {
            verifyCount: function (value, field) {//验证方法名
                if (field.getValue().length > 1) {
                    return true;
                } else {
                    return false;
                }
            },
            verifyCountText: '关联属性的数量必须大于1'
        });
        me.attributeArray = [];
        me.depends = [];
        me.title = i18n.getKey('create');
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                itemId: 'saveButton',
                handler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    var leftGrid = form.ownerCt.getComponent('constraintGrid');
                    var data = {};
                    data.clazz = 'com.qpp.cgp.domain.attributemapping.enableoption.MultiDiscreteAttributeEnableOptionMapping';
                    data.productId = form.productId;
                    if (me.isValid()) {
                        var lm = me.setLoading();
                        Ext.Array.each(me.items.items, function (item) {
                            if (item.name == 'items') {
                                data.items = item.getSubmitValue();
                            } else if (item.name == 'mappingLinks') {
                                data[item.getName()] = item.getArrayValue();
                            } else if (item.name == 'depends') {
                                data[item.getName()] = item.getArrayValue();
                            } else {
                                data[item.getName()] = item.getValue();
                            }
                        });
                        var recordId = form.recordData ? form.recordData._id : null;
                        delete data.isInclude;
                        form.controller.createOrEditProductAttributeConstraint(data, leftGrid, lm, recordId, form.recordData);
                    }
                }
            }
        ];
        Ext.Array.each(me.skuAttributeIds, function (skuAttributeId) {
            var record = me.OptionSkuAttributeStore.findRecord('id', skuAttributeId);
            me.attributeArray.push(record.data);
        });
        var simpsonsStore = Ext.create('Ext.data.Store', {
            autoSync: true,
            fields: [
                {
                    name: 'executeCondition',
                    type: 'object'
                },
                {
                    name: 'rules',//表
                    type: 'array'
                },
                {
                    name: 'isInclude',
                    type: 'boolean'
                },
                {
                    name: 'clazz',
                    type: 'string',
                    defaultValue: 'com.qpp.cgp.domain.attributemapping.enableoption.MultiDiscreteAttributeEnableOptionMappingItem'
                }

            ],
            pageSize: 25,
            autoLoad: false,
            proxy: {
                type: "pagingmemory",
                reader: {
                    type: "json"
                }
            }
        });
        var mappingLinkStore = me.mappingLinkStore = Ext.create('CGP.product.view.mappinglink.store.MappingLinkStore', {
            pageSize: 10,
            params: {
                filter: Ext.JSON.encode([{
                    name: 'productId',
                    type: 'number',
                    value: me.productId
                }, {
                    name: 'excludeIds',
                    type: 'array',
                    value: me.record ? [me.record.getId()] : []
                }])
            }
        });
        var mappingLinkStore2 = Ext.create('CGP.product.view.mappinglink.store.MappingLinkStore', {
            pageSize: 10,
            params: {
                filter: Ext.JSON.encode([{
                    name: 'productId',
                    type: 'number',
                    value: me.productId
                }])
            }
        });
        var allProductAttributeMappingStore = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.store.AllProductAttributeMappingStore', {
            autoLoad: true,
            pageSize: 10,
            storeId: 'allProductAttributeMappingStore',
            params: {
                filter: Ext.JSON.encode([{
                    name: 'productId',
                    type: 'number',
                    value: me.productId
                }, {
                    name: 'excludeIds',
                    type: 'string',
                    value: me.record ? '[' + me.record.getId() + ']' : '[]'
                }])
            }
        });
        var productProfileAttributeStore = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'memory'
            },
            model: 'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.model.ProductAttributeModel',
            data: []
        });
        var productAttributeStore = Ext.data.StoreManager.get('productAttributeStore');
        me.items = [
            {
                fieldLabel: i18n.getKey('constraintRelatedAttributes'),
                xtype: 'multicombobox',
                editable: false,
                readOnly: true,
                vtype: 'verifyCount',
                allowBlank: false,
                multiSelect: true,
                fieldStyle: 'background-color:silver',
                value: Ext.isEmpty(me.skuAttributeIds) ? [] : me.skuAttributeIds,
                name: 'inSkuAttributeIds',
                valueField: 'id',
                store: me.OptionSkuAttributeStore,
                displayField: 'displayName',
                itemId: 'skuAttribute',
                listeners: {
                    change: function (combox, newValue, oldValue) {
                       ;
                        var attributePropertyPath = combox.ownerCt.getComponent('attributePropertyPath');
                        var skuAttributeId = attributePropertyPath.getComponent('skuAttributeId');
                        if (newValue.length >= 2) {
                            var productProfileAttributeStore = skuAttributeId.store;
                            productProfileAttributeStore.proxy.data = [];
                            skuAttributeId.setDisabled(false);
                            for (var i = 0; i < newValue.length; i++) {
                                var data = combox.store.findRecord('id', newValue[i]).getData();
                                productProfileAttributeStore.proxy.data.push(data);
                            }
                            productProfileAttributeStore.load();
                        } else {
                            skuAttributeId.reset();
                            skuAttributeId.setDisabled(true);
                        }
                    }
                }
            },
            {
                name: 'enable',
                xtype: 'checkbox',
                checked: true,
                fieldLabel: i18n.getKey('enable'),
                itemId: 'enable'
            },
            {
                name: 'isInclude',
                xtype: 'checkbox',
                checked: true,
                hidden: true,
                fieldLabel: i18n.getKey('include'),
                itemId: 'isInclude'
            },
            {
                name: 'description',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            },
            {
                xtype: 'gridcombo',
                editable: false,
                allowBlank: false,
                itemId: 'mappingLinks',
                fieldLabel: i18n.getKey('mappingLinks'),
                multiSelect: true,
                name: 'mappingLinks',
                displayField: 'linkName',
                valueField: '_id',
                store: mappingLinkStore,
                matchFieldWidth: false,
                gridCfg: {
                    store: mappingLinkStore,
                    maxHeight: 280,
                    width: 350,
                    selType: 'checkboxmodel',
                    columns: [
                        {
                            dataIndex: '_id',
                            width: 100,
                            text: i18n.getKey('id')
                        },
                        {
                            dataIndex: 'linkName',
                            flex: 1,
                            text: i18n.getKey('linkName'),
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: mappingLinkStore,
                        emptyMsg: i18n.getKey('noData')
                    })
                },
                listeners: {
                    change: function (gridcombo, newValue, oldValue) {
                        var fieldset = gridcombo.ownerCt;
                        var oldDepends = [];
                        for (var i = 0; i < fieldset.depends.length; i++) {
                            oldDepends.push(fieldset.depends[i]._id);
                        }
                        var depends = gridcombo.ownerCt.getComponent('depends');
                        var dependIds = Object.keys(depends.getValue());
                        if (oldDepends.length > 0) {
                            dependIds = oldDepends;
                        }
                        var filter = Ext.JSON.decode(allProductAttributeMappingStore.params.filter);
                        filter[2] = {
                            name: "mappingLinkIds",
                            value: Object.keys(newValue).toString(),
                            type: "string"
                        };
                        allProductAttributeMappingStore.params.filter = Ext.JSON.encode(filter);
                        allProductAttributeMappingStore.loadPage(1, {
                            callback: function (records) {
                                if (records.length > 0) {
                                    depends.setDisabled(false);
                                    oldDepends = [];
                                    fieldset.depends = [];
                                    if (dependIds.length > 0) {
                                        var url = adminPath + 'api/productAttributeMappings?page=1&start=0&limit=100';
                                        filter[3] = {
                                            name: "includeIds",
                                            type: "string",
                                            value: dependIds.toString()
                                        };
                                        url = url + '&filter=' + Ext.JSON.encode(filter);
                                        Ext.Ajax.request({
                                            url: encodeURI(url),
                                            method: 'GET',
                                            headers: {
                                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                            },
                                            success: function (response) {
                                                var responseMessage = Ext.JSON.decode(response.responseText);
                                                if (responseMessage.success) {
                                                    depends.setValue(responseMessage.data.content);
                                                } else {
                                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                                }
                                            },
                                            failure: function (response) {
                                                var responseMessage = Ext.JSON.decode(response.responseText);
                                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                            }
                                        });
                                    }
                                } else {
                                    depends.setValue();
                                    depends.setDisabled(true);
                                }
                            }
                        });
                        var entryLink = gridcombo.ownerCt.getComponent('attributePropertyPath').getComponent('entryLink');
                        if (Object.keys(newValue).length > 0) {
                            entryLink.setDisabled(false);
                        } else {
                            entryLink.setDisabled(true);
                        }
                    }
                },
            },
            {
                xtype: 'gridcombo',
                editable: false,
                itemId: 'depends',
                fieldLabel: i18n.getKey('depend') + i18n.getKey('的其他映射'),
                multiSelect: true,
                name: 'depends',
                disabled: true,
                haveReset: true,
                displayField: 'description',
                tipInfo: '即该映射运行时需要用到的某些属性，是其他指定属性映射运行后的结果的值',
                valueField: '_id',
                allowBlank: true,
                store: allProductAttributeMappingStore,
                matchFieldWidth: false,
                isHiddenCheckSelected: false,
                gridCfg: {
                    store: allProductAttributeMappingStore,
                    maxHeight: 280,
                    width: 700,
                    selType: 'checkboxmodel',
                    columns: [
                        {
                            dataIndex: '_id',
                            width: 80,
                            tdCls: 'vertical-middle',
                            text: i18n.getKey('id')
                        },
                        {
                            dataIndex: 'description',
                            width: 250,
                            tdCls: 'vertical-middle',
                            text: i18n.getKey('description'),
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        },
                        {
                            dataIndex: 'outputs',
                            flex: 1,
                            tdCls: 'vertical-middle',
                            text: i18n.getKey('该映射影响的属性'),
                            renderer: function (value, metadata, record) {
                                var clazz = record.get('clazz');
                                var result = [];
                                if (clazz == 'com.qpp.cgp.domain.attributemapping.twoway.TwoWayProductAttributeMapping') {
                                    var attributeIds = record.get('rightSkuAttributeIds').concat(record.get('leftSkuAttributeIds'));
                                    for (var i = 0; i < attributeIds.length; i++) {
                                        var skutAttributeId = attributeIds[i];
                                        var record = productAttributeStore.findRecord('id', skutAttributeId);
                                        var name = record.get('displayName');
                                        result.push(name + '(' + skutAttributeId + ')');
                                    }
                                } else {
                                    var outPuts = record.get('outputs');
                                    var outSkuAttributeIds = record.get('outSkuAttributeIds');
                                    if (outPuts) {
                                        for (var i = 0; i < outPuts.length; i++) {
                                            var skutAttributeId = outPuts[i].propertyPath.skuAttributeId;
                                            var record = productAttributeStore.findRecord('id', skutAttributeId);
                                            var name = record.get('displayName');
                                            result.push(name + '(' + skutAttributeId + ')');
                                        }
                                    } else {
                                        for (var i = 0; i < outSkuAttributeIds.length; i++) {
                                            var skutAttributeId = outSkuAttributeIds[i];
                                            var record = productAttributeStore.findRecord('id', skutAttributeId);
                                            var name = record.get('displayName');
                                            result.push(name + '(' + skutAttributeId + ')');
                                        }
                                    }
                                }
                                metadata.tdAttr = 'data-qtip="' + result + '"';
                                var returnStr = '';
                                for (var i = 0; i < result.length; i++) {
                                    if (i <= 4) {
                                        if (i % 2 != 0) {
                                            returnStr += ' ,' + result[i] + '<br>'
                                        } else {
                                            returnStr += result[i];
                                        }
                                    } else if (i > 4) {
                                        returnStr += ', ' + new Ext.Template('<a style="font-size: initial" href="javascript:{handler}">' + 'more...' + '</a>').apply({
                                            handler: "showWindow('" + result + "')"
                                        });
                                        break;
                                    }
                                }
                                return returnStr;
                            }
                        }
                    ],
                    viewConfig: {
                        loadMask: false
                    },
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: allProductAttributeMappingStore,
                        emptyMsg: i18n.getKey('noData')
                    }),
                   /* listeners: {
                        beforedeselect: function () {
                            if (event.toElement.nodeName == 'A') {//点击时不要触发反选
                                return false;
                            }
                        }
                    }*/
                }
            },
            {
                name: 'attributePropertyPath',
                itemId: 'attributePropertyPath',
                type: 'fieldset',
                width: 850,
                height: 120,
                colspan: 2,
                title: i18n.getKey('映射触发点'),
                defaults: {
                    allowBlank: false,
                    width: 250,
                    margin: '10 10 0 10'
                },
                layout: {
                    type: 'table',
                    columns: 3
                },
                style: {
                    borderRadius: '10px'
                },
                xtype: 'fieldset',
                fieldLabel: i18n.getKey('映射触发点'),
                getName: function () {
                    return this.name;
                },
                reset: function () {
                    var me = this;
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                        item.reset();
                    }
                },
                clearInvalid: function () {
                    var me = this;
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                        item.clearInvalid();
                    }
                },
                getValue: function () {
                    var me = this;
                    var result = {};
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                        if (item.getName() == 'skuAttributeId') {
                            result[item.getName()] = Object.keys(item.getValue())[0];
                        } else if (item.getName() == 'entryLink') {
                            if (Ext.isEmpty(item.getValue()) || Ext.Object.isEmpty(item.getValue())) {
                                //不填值
                            } else {
                                result[item.getName()] = {
                                    _id: Object.keys(item.getValue())[0],
                                    clazz: 'com.qpp.cgp.domain.attributecalculate.MappingLink'
                                };
                            }
                        } else if (item.getName() == 'attributeProfile') {
                            result[item.getName()] = {
                                _id: item.getValue(),
                                clazz: 'com.qpp.cgp.domain.attributeconfig.AttributeProfile'
                            };
                        } else if (item.getName() == 'propertyName') {
                            result[item.getName()] = item.getValue();
                        }
                    }
                    result.clazz = 'com.qpp.cgp.domain.attributeproperty.PropertyPathDto'
                    return result
                },
                setValue: function (data) {
                    if (data) {
                        var me = this;
                        for (var i = 0; i < me.items.items.length; i++) {
                            var item = me.items.items[i];
                            if (item.getName() == 'skuAttributeId') {
                                item.store.load();
                                item.setSubmitValue(data[item.getName()].toString());
                            } else if (item.getName() == 'entryLink') {
                                if (data[item.getName()]) {
                                    item.setInitialValue([data[item.getName()]._id]);
                                }
                            } else if (item.getName() == 'attributeProfile') {
                                item.setValue(data[item.getName()]._id);
                            } else if (item.getName() == 'propertyName') {
                                item.setValue(data[item.getName()]);
                            }
                        }
                    }
                },
                items: [
                    {
                        xtype: 'combo',
                        store: Ext.data.StoreManager.get('profileStore'),
                        valueField: '_id',
                        itemId: 'attributeProfile',
                        editable: false,
                        name: 'attributeProfile',
                        queryMode: 'local',
                        displayField: 'name',
                        haveReset: true,
                        allowBlank: true,
                        fieldLabel: i18n.getKey('attributeProfile')
                    },
                    {
                        xtype: 'gridcombo',
                        editable: false,
                        itemId: 'skuAttributeId',
                        displayField: 'attributeName',
                        valueField: 'id',
                        disabled: true,
                        fieldLabel: i18n.getKey('skuAttribute'),
                        allowBlank: false,
                        store: productProfileAttributeStore,
                        name: 'skuAttributeId',
                        matchFieldWidth: true,
                        gridCfg: {
                            store: productProfileAttributeStore,
                            height: 200,
                            columns: [
                                {
                                    dataIndex: 'attributeName',
                                    flex: 1,
                                    tdCls: 'vertical-middle',
                                    text: i18n.getKey('attributeName')
                                }
                            ]
                        },
                        listeners: {
                            change: function (gridCombo, newValue, oldValue) {
                                var newValueId = Object.keys(newValue)[0];
                                var oldValueId = null;
                                if (oldValue) {
                                    oldValueId = Object.keys(oldValue)[0];
                                }
                                if (newValueId == oldValueId) {
                                    return;
                                }
                                var propertyCombo = gridCombo.ownerCt.getComponent('propertyName');
                                if (!Ext.Object.isEmpty(newValue)) {
                                    propertyCombo.setDisabled(false);
                                    propertyCombo.setFieldStyle('background-color: white');
                                    propertyCombo.addCls(propertyCombo.invalidCls)
                                } else {
                                    propertyCombo.setDisabled(true);
                                    propertyCombo.setFieldStyle('background-color: silver');
                                }
                                if (!Ext.Object.isEmpty(newValue)) {
                                    var skuAttribute = newValue[gridCombo.getSubmitValue()[0]];
                                    if (skuAttribute.attribute.options.length > 0) {
                                        //选项类型
                                        propertyCombo.store.proxy.data = me.inputTypeProperty.concat(me.optionTypeProperty);
                                    } else {
                                        //输入类型
                                        propertyCombo.store.proxy.data = me.inputTypeProperty;
                                    }
                                    propertyCombo.store.load();
                                }
                                propertyCombo.setValue();
                            }
                        }
                    },
                    {
                        xtype: 'combo',
                        name: 'propertyName',
                        itemId: 'propertyName',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['display', 'value'],
                            data: me.optionTypeProperty.concat(me.inputTypeProperty),
                            listeners: {
                                load: function (store, records) {
                                    store.filter([{//去除Original
                                        fn: function (record) {
                                            return !record.get('display').startsWith('Original');
                                        }
                                    }]);
                                }
                            }
                        }),
                        disabled: true,
                        fieldStyle: 'background-color: silver',
                        valueField: 'value',
                        editable: false,
                        displayField: 'display',
                        allowBlank: false,
                        fieldLabel: i18n.getKey('property')
                    },
                    {
                        xtype: 'gridcombo',
                        editable: false,
                        allowBlank: true,
                        itemId: 'entryLink',
                        fieldLabel: i18n.getKey('作为哪条链的触发起点'),
                        multiSelect: false,
                        name: 'entryLink',
                        haveReset: true,
                        colspan: 3,
                        displayField: 'linkName',
                        valueField: '_id',
                        tipInfo: '选择作为哪条链的触发起点，一次操作，同时触发一条链',
                        store: mappingLinkStore2,
                        matchFieldWidth: false,
                        gridCfg: {
                            store: mappingLinkStore2,
                            width: 450,
                            maxHeight: 280,
                            columns: [
                                {
                                    dataIndex: '_id',
                                    width: 100,
                                    text: i18n.getKey('id')
                                },
                                {
                                    dataIndex: 'linkName',
                                    flex: 1,
                                    text: i18n.getKey('linkName'),
                                    renderer: function (value, metadata, record) {
                                        metadata.tdAttr = 'data-qtip="' + value + '"';
                                        return value;
                                    }
                                }
                            ],
                            bbar: Ext.create('Ext.PagingToolbar', {
                                store: mappingLinkStore2,
                                emptyMsg: i18n.getKey('noData')
                            })
                        },
                        listeners: {
                            expand: function (gridCombo) {
                                var mappingLinks = gridCombo.ownerCt.ownerCt.getComponent('mappingLinks');
                                var mappingLinksIds = Object.keys(mappingLinks.getValue());
                                gridCombo.store.proxy.extraParams = {
                                    filter:
                                        Ext.JSON.encode([{
                                            name: 'includeIds',
                                            type: 'string',
                                            value: '[' + mappingLinksIds.toString() + ']'
                                        }])
                                };
                                gridCombo.store.load();
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'gridfield',
                name: 'items',
                itemId: 'items',
                allowBlank: false,
                msgTarget: 'under',
                fieldLabel: i18n.getKey('规则列表'),
                width: 600,
                height: 230,
                labelAlign: 'top',
                valueSource: 'storeProxy',//’storeData‘,'storeProxy',规定使用getSubmitValue时，从store.items还是从store.proxy.data中获取数据
                gridConfig: {
                    viewConfig: {
                        enableTextSelection: true
                    },
                    height: 500,
                    model: 'grid',//标记是用tree来新建，还是用grid来新建
                    renderTo: me.itemsID,
                    autoScroll: true,
                    width: 700,
                    dockedItems: [
                        {
                            xtype: 'pagingtoolbar',
                            store: simpsonsStore, // same store GridPanel is using
                            pageSize: 25,
                            dock: 'bottom',
                            displayInfo: true
                        }
                    ],
                    store: simpsonsStore,
                    columns: [
                        {
                            xtype: 'actioncolumn',
                            tdCls: 'vertical-middle',
                            itemId: 'actioncolumn',
                            width: 60,
                            sortable: false,
                            resizable: false,
                            menuDisabled: true,
                            items: [
                                {
                                    iconCls: 'icon_edit icon_margin',
                                    itemId: 'actionedit',
                                    tooltip: 'Edit',
                                    handler: function (view, rowIndex, colIndex, icon, event, record) {
                                        var grid = view.ownerCt;
                                        var gridField = grid.gridField;
                                        var skuAttribute = gridField.ownerCt.getComponent('skuAttribute');
                                        var OptionSkuAttributeStore = gridField.ownerCt.OptionSkuAttributeStore;
                                        if (grid.model == 'grid') {
                                            var win = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.view.CreateOrEditConstraintRuleListDataWindow', {
                                                grid: grid,
                                                record: record,
                                                createOrEdit: 'edit',
                                                selectedSkuAttributeIds: skuAttribute.getValue(),
                                                skuAttributeStore: OptionSkuAttributeStore,
                                                productId: me.productId
                                            });
                                        } else {
                                            var win = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.view.CreateOrEditConstraintRuleDecisionTreeDataWindow', {
                                                grid: grid,
                                                selectedSkuAttributeIds: skuAttribute.getValue(),
                                                record: record,
                                                createOrEdit: 'edit',
                                                skuAttributeStore: OptionSkuAttributeStore,
                                                productId: me.productId
                                            });
                                        }
                                        win.show();
                                        win.refreshData(record.getData());
                                    }
                                },
                                {
                                    iconCls: 'icon_remove icon_margin',
                                    itemId: 'actionremove',
                                    tooltip: 'Remove',
                                    handler: function (view, rowIndex, colIndex) {
                                        var store = view.getStore();
                                        store.proxy.data.splice(rowIndex, 1);
                                        store.load();
                                    }
                                }

                            ]
                        },
                        {
                            text: i18n.getKey('status'),
                            dataIndex: 'isInclude',
                            tdCls: 'vertical-middle',
                            flex: 1,
                            renderer: function (value, metadata, record) {
                                if (value == true) {
                                    return '启用以下属性组合';
                                } else {
                                    return '禁止以下属性组合'
                                }
                            }
                        },
                        {
                            text: i18n.getKey('condition'),
                            dataIndex: 'executeCondition',
                            tdCls: 'vertical-middle',
                            flex: 1,
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                                metadata.tdAttr = 'data-qtip="查看条件"';
                                var grid = gridView.ownerCt;
                                var gridField = grid.gridField;
                                var skuAttributeStore = gridField.ownerCt.skuAttributeStore;
                                if ((value.executeAttributeInput && value.executeAttributeInput.operation.operations.length > 0) ||
                                    value.executeProfileItemIds.length > 0 ||
                                    value.executeAttributeInput.operation.expression) {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<a href="#")>查看执行条件</a>',
                                        listeners: {
                                            render: function (display) {
                                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                ela.on("click", function () {
                                                    var controller = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.controller.Controller');
                                                    //controller.checkCondition(value, grid.skuAttributeStore, grid.productId);
                                                    controller.checkConditionV2(value, skuAttributeStore, me.productId);
                                                });
                                            }
                                        }
                                    };

                                } else {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<font color="green">无条件执行</font>'
                                    };
                                }

                            }
                        },
                        {
                            text: i18n.getKey('属性组合'),
                            tdCls: 'vertical-middle',
                            dataIndex: 'rules',
                            flex: 1,
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                                console.log(value);
                                var isInclude = record.get('isInclude');
                                if (gridView.ownerCt.model == 'grid') {
                                    metadata.tdAttr = 'data-qtip="查看组合"';
                                    var grid = gridView.ownerCt;
                                    var gridField = grid.gridField;
                                    var skuAttribute = gridField.ownerCt.getComponent('skuAttribute');
                                    var OptionSkuAttributeStore = gridField.ownerCt.OptionSkuAttributeStore;
                                    return {
                                        xtype: 'displayfield',
                                        value: '<a href="#")>查看组合</a>',
                                        listeners: {
                                            render: function (display) {
                                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                ela.on("click", function () {
                                                    me.controller.checkAttributeRuleGrid(value, OptionSkuAttributeStore, skuAttribute.getValue());
                                                });
                                            }
                                        }
                                    };
                                } else {
                                    metadata.tdAttr = 'data-qtip="查看决策树"';
                                    var grid = gridView.ownerCt;
                                    var gridField = grid.gridField;
                                    var skuAttribute = gridField.ownerCt.getComponent('skuAttribute');
                                    var OptionSkuAttributeStore = gridField.ownerCt.OptionSkuAttributeStore;
                                    return {
                                        xtype: 'displayfield',
                                        value: '<a href="#")>查看决策树</a>',
                                        listeners: {
                                            render: function (display) {
                                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                ela.on("click", function () {
                                                    me.controller.checkAttributeRuleTree(value, isInclude);
                                                });
                                            }
                                        }
                                    };
                                }
                            }
                        }
                    ],
                    tbar: [
                        {
                            text: i18n.getKey('create'),
                            iconCls: 'icon_create',
                            menu: [
                                {
                                    text: '列表',
                                    handler: function () {
                                        var grid = this.ownerCt.ownerButton.ownerCt.ownerCt;
                                        var gridField = grid.gridField;
                                        var skuAttribute = gridField.ownerCt.getComponent('skuAttribute');
                                        var OptionSkuAttributeStore = gridField.ownerCt.OptionSkuAttributeStore;
                                        if (skuAttribute.getValue().length > 1) {
                                            console.log(grid);
                                            var win = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.view.CreateOrEditConstraintRuleListDataWindow', {
                                                grid: grid,
                                                selectedSkuAttributeIds: skuAttribute.getValue(),
                                                record: null,
                                                createOrEdit: 'create',
                                                skuAttributeStore: OptionSkuAttributeStore,
                                                productId: me.productId
                                            });
                                            win.show();
                                        } else if (skuAttribute.getValue().length == 1) {
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('关联属性数量必须大于1'));
                                        } else {
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请先选择关联属性'));

                                        }
                                    }
                                },
                                {
                                    text: '决策树',
                                    handler: function () {
                                        var grid = this.ownerCt.ownerButton.ownerCt.ownerCt;
                                        var gridField = grid.gridField;
                                        var skuAttribute = gridField.ownerCt.getComponent('skuAttribute');
                                        var OptionSkuAttributeStore = gridField.ownerCt.OptionSkuAttributeStore;
                                        if (skuAttribute.getValue().length > 1) {
                                            var win = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.view.CreateOrEditConstraintRuleDecisionTreeDataWindow', {
                                                grid: grid,
                                                selectedSkuAttributeIds: skuAttribute.getValue(),
                                                record: null,
                                                createOrEdit: 'create',
                                                skuAttributeStore: OptionSkuAttributeStore,
                                                productId: me.productId
                                            });
                                            win.show();
                                        } else if (skuAttribute.getValue().length == 1) {
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('关联属性数量必须大于1'));
                                        } else {
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请先选择关联属性'));
                                        }
                                    }
                                }
                            ],
                        }
                    ],
                    listeners: {
                        afterrender: function (grid) {
                            grid.store.on('datachanged', function (store) {
                                var skuAttribute = grid.gridField.ownerCt.getComponent('skuAttribute');
                                if (store.getCount() == 0) {
                                    skuAttribute.setReadOnly(false);
                                    skuAttribute.setFieldStyle('background-color:white');
                                } else {
                                    skuAttribute.setReadOnly(true);
                                    skuAttribute.setFieldStyle('background-color:silver');
                                }
                            })
                        }
                    }
                }
            }
        ];
        me.listeners = {
            afterrender: function () {
                me.setDisabled(true);
            }
        };
        me.callParent(arguments);
        me.on('afterrender', function () {
            var page = this;
            var productId = me.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    },
    refreshData: function (data, record) {
        var me = this;
        me.record = record;
        var productId = me.productId;
        var isLock = JSCheckProductIsLock(productId);
        if (data) {
            me.down('toolbar').getComponent('saveButton').setDisabled(false || isLock);
            me.setDisabled(false);
            me.setTitle('编辑多属性约束(' + data._id + ')');
            var skuAttribute = me.getComponent('skuAttribute');
            skuAttribute.setReadOnly(true);
            me.createOrEdit = 'edit';
            var skuAttributeStore = me.skuAttributeStore;
            skuAttribute.setFieldStyle('background-color:silver');
            me.inSkuAttributeIds = data.inSkuAttributeIds;
            me.attributeArray = [];
            me.recordData = data;
            for (var i = 0; i < data.items.length; i++) {
                var item = data.items[i];
                var executeAttributeInput = item.executeCondition.executeAttributeInput;
                if (executeAttributeInput) {
                    if (executeAttributeInput.operation)
                        var operations = executeAttributeInput.operation.operations;
                    for (var j = 0; j < operations.length; j++) {
                        var operator = operations[j].operator;
                        if (Ext.Array.contains(['[min,max]', '[min,max)', '(min,max)', '(min,max]'], operator)) {//区间类型
                            var skuAttributeData = skuAttributeStore.findRecord('id', operations[j].midValue.skuAttributeId).getData();
                            operations[j].midValue.skuAttribute = skuAttributeData;
                        } else {//普通比较类型
                            var skuAttributeData = skuAttributeStore.findRecord('id', operations[j].operations[0].skuAttributeId).getData();
                            operations[j].operations[0].skuAttribute = skuAttributeData;
                        }
                    }
                }
            }
            Ext.Array.each(me.items.items, function (item) {
                if (item.name == 'items') {
                    item.getGrid().getStore().getProxy().data = [].concat(data.items);
                    item.getGrid().getStore().load();
                    if (data.items[0]) {
                        if (data.items[0].rules[0].clazz != "com.qpp.cgp.domain.attributemapping.enableoption.DecisionTree") {
                            item.getGrid().model = 'grid';
                        } else {
                            item.getGrid().model = 'tree';
                        }
                    }
                } else {
                    if (data[item.name]) {
                        if (item.name == 'mappingLinks') {
                            console.log(data[item.name]);
                            var objArr = data[item.name];
                            var ids = [];
                            for (var i = 0; i < objArr.length; i++) {
                                ids.push(objArr[i]._id);
                            }
                            item.setInitialValue(ids);
                        } else {
                            item.setValue(data[item.name]);
                        }
                    } else {
                        item.reset();
                    }
                }
            });
        } else {
            me.createOrEdit = 'create';
            me.recordData = null;
            var skuAttribute = me.getComponent('skuAttribute');
            skuAttribute.setReadOnly(false);
            skuAttribute.setFieldStyle('background-color:white');
            Ext.Array.each(me.items.items, function (item) {
                item.reset();
                item.clearInvalid();
            })
        }
    }
});
