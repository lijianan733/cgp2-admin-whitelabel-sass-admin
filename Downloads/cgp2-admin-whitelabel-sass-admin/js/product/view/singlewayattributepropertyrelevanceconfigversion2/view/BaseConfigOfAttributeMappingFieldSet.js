/**
 * Created by nan on 2019/10/25.
 * 映射基本配置
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.BaseConfigOfAttributeMappingFieldSet', {
    extend: 'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.DiyFieldSet',
    productId: null,
    requires: ['CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.model.ProductAttributeModel'],
    defaults: {
        width: 400,
        margin: '5 10 5 10'
    },
    layout: {
        type: 'table',
        columns: 2
    },
    record: null,
    componentUUId: null,
    skuAttributeStore: null,
    depends: null,
    mappingLinkStore: null,
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
            value: 'ReadOnly',
            display: 'ReadOnly'
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
    getValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.xtype == 'gridcombo') {
                result[item.getName()] = [];
                var skuAttribute = item.getValue();
                for (var j in skuAttribute) {
                    result[item.getName()].push(skuAttribute[j]);
                }
            } else {
                result[item.getName()] = item.getValue();
            }
        }
        console.log(result);
        return result;
    },
    setValue: function (data) {
        var me = this;
        me.depends = data['depends'] || [];
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.getName() == 'inSkuAttributes' || item.getName() == 'outSkuAttributes') {
                var idArr = data[item.getItemId()];
                var skuAttArr = [];
                for (var j = 0; j < idArr.length; j++) {
                    skuAttArr.push(me.skuAttributeStore.findRecord('id', idArr[j]).getData());
                }
                item.setValue(skuAttArr);
            } else if (item.getName() == 'mappingLinks') {
                var ids = [];
                data[item.getItemId()].forEach(function (mappingLink) {
                    ids.push(mappingLink._id)
                })
                if (item.store.data.length > 0) {
                    item.setSubmitValue(ids.toString());
                } else {
                    var gridCombo = item;
                    item.store.on('load', function () {
                        gridCombo.setInitialValue(ids);
                    }, gridCombo.store, {
                        single: true
                    })
                }
            } /*else if (item.getName() == 'depends') {
                me.depends = data[item.getItemId()];
                var depends = data[item.getItemId()];
                var dependIds = [];
                for (var j = 0; j < depends.length; j++) {
                    dependIds.push(depends[j]._id);
                }
                if (item.store.data.length == 0) {
                    var dependsField = item;
                    dependsField.store.on('load', function () {
                        dependsField.setSubmitValue(dependIds.toString());
                    }, dependsField.store, {
                        single: true
                    })
                } else {
                    item.setSubmitValue(dependIds.toString());
                }
            }*/ else {
                item.setValue(data[item.getItemId()]);
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.depends = [];
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
        var leftStore = Ext.create('Ext.data.Store', {
            model: 'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.model.ProductAttributeModel',
            data: [],
            proxy: {
                type: 'memory'
            }
        });
        var rightStore = Ext.create('Ext.data.Store', {
            model: 'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.model.ProductAttributeModel',
            data: [],
            proxy: {
                type: 'memory'
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
        for (var i = 0; i < productAttributeStore.data.items.length; i++) {
            var record = productAttributeStore.data.items[i];
            leftStore.proxy.data.push(record.getData());
            rightStore.proxy.data.push(record.getData());
            productProfileAttributeStore.proxy.data.push(record.getData());
        }
        leftStore.load();
        rightStore.load();
        var allProductAttributeMappingStore = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.store.AllProductAttributeMappingStore', {
            autoLoad: true,
            pageSize: 10,
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
        //依赖中影响的属性数量大于5时，弹窗显示更多
        window.showWindow = function (data) {
            data = data.split(',');
            var dataArr = data.map(function (item) {
                return {
                    displayName: item.split(/[(,)]/)[0],//使用正则分割
                    id: item.split(/[(,)]/)[1],//使用正则分割
                }
            })
            var win = Ext.create('Ext.window.Window', {
                modal: true,
                constrain: true,
                layout: 'fit',
                title: i18n.getKey('该映射影响的属性'),
                items: [
                    {
                        xtype: 'grid',
                        width: 400,
                        height: 500,
                        autoScroll: true,
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'displayName',
                                'id'
                            ],
                            data: dataArr
                        }),
                        columns: [
                            {
                                dataIndex: 'id',
                                text: i18n.getKey('id'),
                            },
                            {
                                dataIndex: 'displayName',
                                flex: 1,
                                text: i18n.getKey('displayName'),
                            }
                        ]
                    }
                ]
            });
            win.show();

        };
        me.items = [
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                name: 'description',
                itemId: 'description',
                allowBlank: false
            },
            {
                xtype: 'multicombobox',
                itemId: 'inSkuAttributeIds',
                editable: false,
                multiSelect: true,
                matchFieldWidth: true,
                allowBlank: false,
                fieldLabel: i18n.getKey('参数属性'),
                name: 'inSkuAttributeIds',
                store: productAttributeStore,
                displayField: 'attributeName',
                valueField: 'id'
            },
            {
                xtype: 'multicombobox',
                itemId: 'outSkuAttributeIds',
                editable: false,
                multiSelect: true,
                matchFieldWidth: true,
                allowBlank: false,
                fieldLabel: i18n.getKey('参数属性'),
                name: 'outSkuAttributeIds',
                store: productAttributeStore,
                displayField: 'attributeName',
                valueField: 'id'
            },
            {
                xtype: 'gridcombo',
                editable: false,
                allowBlank: false,
                itemId: 'inSkuAttributeIds',
                fieldLabel: i18n.getKey('输入属性'),
                multiSelect: true,
                displayField: 'attributeName',
                valueField: 'id',
                name: 'inSkuAttributes',
                store: leftStore,
                matchFieldWidth: true,
                listeners: {
                    /*            afterrender: function (field) {//使两个gridcombo可选的内容互补
                                    field.store.on('load',
                                        function () {
                                            var rightAttributeValue = field.ownerCt.getComponent('outSkuAttributeIds').getSubmitValue();
                                            field.store.filterBy(function (item) {
                                                return !Ext.Array.contains(rightAttributeValue, item.getId());
                                            })
                                        })
                                },
                                expand: function () {
                                    this.store.load();
                                }*/
                },
                gridCfg: {
                    store: leftStore,
                    maxHeight: 280,
                    selType: 'checkboxmodel',
                    columns: [
                        {
                            dataIndex: 'attributeName',
                            flex: 1,
                            text: i18n.getKey('attributeName')
                        }
                    ]
                }
            },
            {
                xtype: 'gridcombo',
                editable: false,
                allowBlank: false,
                itemId: 'outSkuAttributeIds',
                fieldLabel: i18n.getKey('被影响属性'),
                multiSelect: true,
                name: 'outSkuAttributes',
                displayField: 'attributeName',
                valueField: 'id',
                store: rightStore,
                matchFieldWidth: true,
                listeners: {
                    /*    afterrender: function (field) {//使两个gridcombo可选的内容互补
                            field.store.on('load',
                                function () {
                                    var rightAttributeValue = field.ownerCt.getComponent('inSkuAttributeIds').getSubmitValue();
                                    field.store.filterBy(function (item) {
                                        return !Ext.Array.contains(rightAttributeValue, item.getId());
                                    })
                                })
                        },
                        expand: function () {
                            this.store.load();
                        }*/
                },
                gridCfg: {
                    store: rightStore,
                    maxHeight: 280,
                    selType: 'checkboxmodel',
                    columns: [
                        {
                            dataIndex: 'attributeName',
                            flex: 1,
                            text: i18n.getKey('attributeName')
                        }
                    ]
                }
            },
            {
                xtype: 'gridcombo',
                editable: false,
                allowBlank: false,
                itemId: 'mappingLinks',
                id: 'mappingLinks',
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
                        //作为哪条链的触发点的可选链，从该项选中的链的其中一个
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
                colspan: 2,
                name: 'depends',
                tipInfo: '即该映射运行时需要用到的某些属性，是其他指定属性映射运行后的结果的值',
                disabled: true,
                haveReset: true,
                displayField: 'description',
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
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: allProductAttributeMappingStore,
                        displayInfo: true,  //是否显示，分页信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //显示的分页信息
                        emptyMsg: i18n.getKey('noData')
                    }),
/*
                    listeners: {
                        beforedeselect: function () {
                            if (event.toElement.nodeName == 'A') {//点击时不要触发反选

                                return false;
                            }
                        }
                    }
*/
                }
            },
            {
                name: 'attributePropertyPath',
                itemId: 'attributePropertyPath',
                xtype: 'fieldset',
                width: 850,
                height: 110,
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
                getName: function () {
                    return this.name;
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
                        fieldLabel: i18n.getKey('attributeProfile'),
                        listeners: {
                            change: function (combo, newValue, oldValue) {
                                var skuAttributeCombo = combo.ownerCt.getComponent('skuAttributeId');
                                if (newValue) {
                                    var skuAttributes = [];
                                    var profileData = this.store.findRecord('_id', this.getValue()).getData();
                                    for (var i = 0; i < profileData.groups.length; i++) {
                                        skuAttributes = skuAttributes.concat(profileData.groups[i].attributes);
                                    }
                                    skuAttributeCombo.store.proxy.data = skuAttributes;
                                    skuAttributeCombo.store.load();
                                    skuAttributeCombo.setValue();
                                } else {
                                    var skuAttributes = [];
                                    for (var i = 0; i < productAttributeStore.getCount(); i++) {
                                        skuAttributes = skuAttributes.concat(productAttributeStore.data.items[i].getData());
                                    }
                                    skuAttributeCombo.store.proxy.data = skuAttributes;
                                    skuAttributeCombo.store.load();
                                }
                            },
                            afterrender: function (combo) {
                                if (combo.store.getCount() == 1) {
                                    combo.setValue(combo.store.getAt(0).getId());
                                }
                            }

                        }
                    },
                    {
                        xtype: 'gridcombo',
                        editable: false,
                        itemId: 'skuAttributeId',
                        displayField: 'attributeName',
                        valueField: 'id',
                        fieldLabel: i18n.getKey('skuAttribute'),
                        allowBlank: false,
                        store: productProfileAttributeStore,
                        name: 'skuAttributeId',
                        matchFieldWidth: false,
                        gridCfg: {
                            store: productProfileAttributeStore,
                            height: 200,
                            width: 200,
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
                        colspan: 3,
                        itemId: 'entryLink',
                        fieldLabel: i18n.getKey('作为哪条链的触发起点'),
                        multiSelect: false,
                        name: 'entryLink',
                        haveReset: true,
                        disabled: true,
                        displayField: 'linkName',
                        valueField: '_id',
                        tipInfo: '选择作为哪条链的触发起点',
                        store: mappingLinkStore2,
                        matchFieldWidth: false,
                        width: 270,
                        gridCfg: {
                            store: mappingLinkStore2,
                            width: 350,
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
            }
        ];
        me.callParent();
    }
})
