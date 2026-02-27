/**
 * Created by nan on 2019/10/23.
 * 产品属性的property约束的设置组件,
 * Attribute根据Options的数量决定类型，大于0的选项型，等于0的输入型
 * 奇怪的逻辑，在新建第一条数据以后，新建和编辑都不能新建和删除已有的property,只能对第一条数据中有的property的值进行更改
 *
 *
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.ConstraintOfAttributePropertyFieldSet', {
    extend: 'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.DiyFieldSet',
    alias: 'widget.constraintofattributepropertyfieldSet',
    skuAttribute: null,//传入的属性
    collapsible: false,
    header: false,
    autoScroll: true,
    margin: '10 40 10 40',
    layout: 'vbox',
    style: {
        borderRadius: '10px'
    },
    productId: null,
    isCanAddOrDelete: true,//是否可以进行编辑和添加
    value: null,//编辑时传入的数据
    deleteSrc: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png',
    addImgUrl: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/add.png',
    switchUrl: path + 'ClientLibs/extjs/resources/themes/images/ux/switchType.png',
    isValid: function () {
        var me = this;
        return true;
    },
    getValue: function () {
        var me = this;
        var result = {
            skuAttribute: me.skuAttribute,
            data: []
        };
        var propertyContainer = me.getComponent('propertyContainer');
        for (var i = 0; i < propertyContainer.items.items.length; i++) {
            var item = propertyContainer.items.items[i];
            var propertyData = item.getComponent('attributePropertyValue').getValue();
            var attributePropertyValue = {id: JSGetCommonKey()}, propertyPath = {
                id: JSGetCommonKey(),
                clazz: 'com.qpp.cgp.domain.attributeproperty.PropertyPathDto',
                entryLink: null
            };
            for (var key in propertyData) {
                if (key == 'skuAttributeId' || key == 'skuAttribute' || key == 'propertyName' || key == 'attributeProfile' || key == 'entryLink') {
                    propertyPath[key] = propertyData[key];
                } else {
                    attributePropertyValue[key] = propertyData[key];
                }
            }
            attributePropertyValue['propertyPath'] = propertyPath;
            result.data.push(attributePropertyValue);
        }
        return result;
    },
    setValue: function () {
        var me = this;
    },
    constructor: function (config) {
        var me = this;
        config.title = "<font size='2' style= 'font-size: larger;color:green;font-weight: bold'>" + i18n.getKey(config.title) + '</font>'
        me.callParent(arguments);
    },
    /**
     *
     * @param data
     * @param multi是否默认多选
     * * @param value 值
     * * @param type 值的类型
     */
    createFieldByAttribute: function (data, defaultMulti, value, type) {
        var me = this;
        if (!data['inputType']) {
            throw Error('data should be a CGP.Model.Attribute instance!');
        }
        var inputType = data['inputType'];
        var selectType = data['selectType'];
        var options = data['options'];
        var item = {};
        item.name = 'value';
        item.fieldLabel = 'propertyValue';
        item.width = 300;
        item.allowBlank = false;
        item.value = value;
        item.itemId = 'propertyValue';
        if (options.length > 0) {//选项类型
            item.xtype = 'combo';
            item.haveReset = true;
            item.allowBlank = true;
            item.reset = function () {
                var me = this;
                me.beforeReset();
                me.setValue();
                me.clearInvalid();
                delete me.wasValid;
                var picker = this.getPicker();
                if (picker && picker.el) {//取消选择
                    var checkBoxs = picker.el.dom.getElementsByTagName("input");
                    for (var i = 0; i < checkBoxs.length; i++) {
                        checkBoxs[i].checked = false;
                    }
                }
            };
            item.multiSelect = defaultMulti ? defaultMulti : (selectType == 'MULTI' ? true : false);
            if (item.multiSelect) {
                item.xtype = 'multicombobox';
                if (!Ext.isEmpty(item.value)) {
                    item.value = item.value.split(',');
                    item.value = item.value.map(function (i) {
                        return parseInt(i)
                    });
                }
            } else {
                if (!Ext.isEmpty(value)) {
                    if (Ext.isNumber(value)) {
                        item.value = value;
                    } else if (Ext.isString(value)) {
                        item.value = Ext.Number.from(value);
                    }
                }
            }
            item.displayField = 'name';
            item.valueField = 'id';//不需要id
            item.editable = false;
            item.store = new Ext.data.Store({
                fields: ['id', 'name'],
                data: options
            });

        } else if (inputType == 'Date') {//输入类型
            item.xtype = 'datetimefield';
            item.editable = false;
            item.format = "Y-m-d H:i:s";
            if (!Ext.isEmpty(item.value)) {
                item.value = new Date(parseInt(item.value));
            }
        } else if (inputType == 'YesOrNo') {
            item.xtype = 'radiogroup';
            var yesItem = {
                name: item.name,
                inputValue: 'YES',
                boxLabel: 'YES'
            }
            var noItem = {
                name: item.name,
                inputValue: 'NO',
                boxLabel: 'NO'
            }
            if (!Ext.isEmpty(value)) {
                if (value == 'YES') {
                    yesItem.checked = true;
                } else if (value == 'NO') {
                    noItem.checked = true;
                }
            }
            item.items = [yesItem, noItem];
            item.columns = 2;
        } else {
            item = {
                xtype: 'fieldcontainer',
                fieldLabel: 'propertyValue',
                width: 350,
                name: 'propertyValue',
                getName: function () {
                    var me = this;
                    return me.name;
                },
                layout: {
                    type: 'column'
                },
                itemId: 'propertyValue',
                items: [
                    {
                        xtype: data['valueType'] == 'Number' ? 'numberfield' : 'textfield',
                        itemId: 'fixValueField',
                        name: 'value',
                        width: 200,
                        decimalPrecision: 8,
                        minValue: 0,
                        columnWidth: 0.8,
                        hidden: type ? (type != 'com.qpp.cgp.domain.executecondition.operation.value.FixValue') : false,
                        disabled: type ? (type != 'com.qpp.cgp.domain.executecondition.operation.value.FixValue') : false,
                        value: value,
                        emptyText: '请输入固定值',
                        margin: '0 5 0 0 '
                    },
                    {
                        xtype: 'textarea',
                        columnWidth: 0.8,
                        width: 200,
                        itemId: 'expressionField',
                        emptyText: '请输入表达式',
                        hidden: type ? (type != 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue') : true,
                        disabled: type ? (type != 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue') : true,
                        name: 'value',
                        value: value,
                        /*  tipInfo: "属性取值:profiles['profileId']['skuAttributeId']['propertyName']<br> 示例：profiles['123']['124']['Value']<br>" +
                              "属性取option的值: profiles['profileId']['skuAttributeId']['Options'][0]['value']<br>  示例：profiles['123']['125']['Options'][0]['value']",*/
                        margin: '0 5 0 0'
                    },
                    {
                        xtype: 'displayfield',
                        itemId: 'switch',
                        columnWidth: 0.2,
                        hidden: me.valueExchange,
                        value: '<img class="tag" title="切换为表达式输入" style="margin-left: 0px;margin-top:-2px;height:24px;width: 24px;cursor: pointer" src="' + me.switchUrl + '">',
                        listeners: {
                            render: function (display) {
                                var a = display.el.dom.getElementsByTagName('img')[0]; //获取到该html元素下的a元素
                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                if (type == 'com.qpp.cgp.domain.executecondition.operation.value.FixValue' || Ext.isEmpty(type)) {
                                    a.title = '切换为表达式输入';
                                } else {
                                    a.title = '切换为固定值输入';
                                }
                                ela.on("click", function () {
                                    console.log(a);
                                    var form = display.ownerCt.ownerCt.ownerCt.ownerCt.ownerCt.ownerCt.ownerCt;
                                    var top = form.body.getScroll().top;
                                    var fixValueField = display.ownerCt.getComponent('fixValueField');
                                    var expressionField = display.ownerCt.getComponent('expressionField');
                                    var itemId = display.ownerCt.getComponent('tipInfo');
                                    if (fixValueField.hidden == true) {
                                        a.title = '切换为表达式输入';
                                        fixValueField.show();
                                        expressionField.hide();
                                        itemId.hide();
                                        expressionField.setDisabled(true);
                                        fixValueField.setDisabled(false);
                                    } else {
                                        a.title = '切换为固定值输入';
                                        fixValueField.hide();
                                        expressionField.show();
                                        itemId.show();
                                        expressionField.setDisabled(false);
                                        fixValueField.setDisabled(true);
                                    }
                                    form.body.setScrollTop(top);
                                });
                            }
                        }
                    },
                    {
                        xtype: 'displayfield',
                        itemId: 'tipInfo',
                        columnWidth: 0.01,
                        fieldStyle: 'background-color:silver;width:0px',
                        value: '',
                        tipInfo: "属性取值:profiles['profileId']['skuAttributeId']['propertyName']<br> 示例：profiles['123']['124']['Value']<br>" +
                            "属性取option的值: profiles['profileId']['skuAttributeId']['Options'][0]['value']<br>  示例：profiles['123']['125']['Options'][0]['value']",
                        hidden: type ? (type != 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue') : true,
                        disabled: type ? (type != 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue') : true
                    }
                ]
            }
        }
        return item;
    },
    initComponent: function () {
        var me = this;
//        me.profileStore=Ext.create('CGP.product.store.AttributeProfile', {
//            skuAttributeId: me.skuAttribute.id
//        });
        Ext.Ajax.request({
            url: adminPath + 'api/skuAttributes/' + me.skuAttribute.id + '/attributeProfiles',
            method: 'GET',
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    me.profileStore = Ext.create('CGP.product.store.AttributeProfile', {
                        model: 'CGP.product.model.AttributeProfile',
                        data: resp.data || [],
                        proxy: {
                            type: 'memory'
                        }
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            }
        });

        me.items = [
            {
                xtype: 'toolbar',
                width: '100%',
                border: true,
                items: [
                    {
                        xtype: 'button',
                        iconCls: 'icon_add',
                        disabled: !me.isCanAddOrDelete,
                        text: i18n.getKey('add'),
                        handler: function (btn) {
                            var fieldSet = btn.ownerCt.ownerCt.ownerCt;
                            btn.ownerCt.ownerCt.addAttributeProperty(null, fieldSet.isCanAddOrDelete)
                        }
                    }
                ]
            },
            {
                xtype: 'panel',
                width: '100%',
                maxHeight: 400,
                autoScroll: true,
                margin: '0 0 10 0',
                border: false,
                itemId: 'propertyContainer'
            }
        ];
        me.callParent();
        me.legend.on('afterrender', function () {
            arguments[0].el.dom.style.margin = '0 auto';
        });
        //me.profileStore.load();
        if (!Ext.isEmpty(me.value)) {
            for (var i = 0; i < me.value.length; i++) {
                me.addAttributeProperty(me.value[i], me.isCanAddOrDelete);
            }
        } else {
            me.addAttributeProperty(null, me.isCanAddOrDelete);
        }

    },
    addAttributeProperty: function (data, isCanAddOrDelete) {
       
        var me = this;
        var propertyContainer = me.getComponent('propertyContainer');
        var checkUUID = JSGetUUID();
        var skuAttribute = me.skuAttribute;
        var property = [
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
            }
        ];
        if (skuAttribute.attribute.options.length > 0) {
            property = property.concat([
                {
                    value: 'EnableOption',
                    display: 'EnableOption'
                },
                {
                    value: 'HiddenOption',
                    display: 'HiddenOption'
                }
            ]);
        } else {
            property = property.concat([
                {
                    value: 'saveAccuracy',
                    display: 'saveAccuracy'
                },
                {
                    value: 'displayAccuracy',
                    display: 'displayAccuracy'
                }
            ]);
        }
        var includedValue = true;
        var propertyNameValue = null;
        var propertyValue = null, attributeProfile = null, entryLink = null;
        var dataType = null;
        if (data) {
            includedValue = !Ext.isEmpty(data.isInclude) ? data.isInclude : true;
            dataType = data.value.clazz;
            propertyNameValue = data.propertyPath.propertyName;
            attributeProfile = data.propertyPath.attributeProfile._id;
            entryLink = data.propertyPath.entryLink;
            if (data.value.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.FixValue') {
                propertyValue = data.value.value;
            } else if (data.value.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue') {
                propertyValue = data.value.calculationExpression;
            }
        }
        var valueField = me.createFieldByAttribute(me.skuAttribute.attribute, null, propertyValue, dataType);
        var optionField = me.createFieldByAttribute(me.skuAttribute.attribute, true, propertyValue, dataType);
        optionField.itemId = 'optionField';
        optionField.hidden = true;
        optionField.disabled = true;
        var container = {
            xtype: 'fieldcontainer',
            margin: '5 0 5 0',
            width: '100%',
            style: {
                borderWidth: '0 0 1px 0',
                borderStyle: 'groove',
                borderColor: '#fff8f8'
            },
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'displayfield',
                    padding: '0 10 0 10 ',
                    itemId: 'delete',
                    disabled: !isCanAddOrDelete,
                    value: '<img class="tag" title="点击进行清除数据" style="height:16px;width: 16px;cursor: pointer" src="' + me.deleteSrc + '">',
                    listeners: {
                        render: function (display) {
                            var a = display.el.dom.getElementsByTagName('img')[0]; //获取到该html元素下的a元素
                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                            ela.on("click", function () {
                                if (display.disabled == true) {
                                    return;
                                }
                                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否清除已填写的数据'), function (selector) {
                                    if (selector === 'yes') {
                                        var container = display.ownerCt;
                                        var panel = container.ownerCt;
                                        panel.remove(container);
                                    }
                                })
                            });
                        }
                    }
                },
                {
                    xtype: 'fieldcontainer',
                    width: '100%',
                    itemId: 'attributePropertyValue',
                    getValue: function () {//每个property都是单独一条记录
                        var me = this;
                        var result = {
                            skuAttribute: skuAttribute,
                            skuAttributeId: skuAttribute.id,
                            clazz: 'com.qpp.cgp.domain.attributeproperty.AttributePropertyValue'
                        };
                        for (var i = 0; i < me.items.items.length; i++) {
                            var item = me.items.items[i];
                            if (item.disabled == false) {
                                if (item.getName() == 'propertyName') {
                                    result[item.getName()] = item.getValue();
                                } else if (item.getName() == 'isInclude') {
                                    for (var k in item.getValue()) {
                                        result[item.getName()] = item.getValue()[k];
                                    }
                                } else if (item.xtype == 'radiogroup') {
                                    for (var j in item.getValue()) {
                                        result[item.getName()] = {
                                            clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                                            value: item.getValue()[j].toString()
                                        }
                                    }
                                } else if (item.getName() == 'attributeProfile') {
                                    result[item.getName()] = {
                                        clazz: 'com.qpp.cgp.domain.attributeconfig.AttributeProfile',
                                        idReference: "AttributeProfile",
                                        _id: Ext.isEmpty(item.getValue()) ? '' : item.getValue(),
                                        name: item.getRawValue()
                                    }
                                } else if (item.getName() == 'entryLink') {
                                    var values = item.getValue(), idReference = null;
                                    if (values) {
                                        for (var key in values) {
                                            if (key != 'undefined' && values[key]) {
                                                idReference = {
                                                    clazz: values[key].clazz,
                                                    idReference: values[key].clazz.substring(values[key].clazz.lastIndexOf('.') + 1),
                                                    _id: values[key]._id,
                                                    linkName: values[key].linkName
                                                };
                                            }
                                        }
                                    }
                                    result[item.getName()] = idReference;
                                } else {//其他情况为propertyValue
                                    if (item.xtype == 'combo') {
                                        result[item.getName()] = {
                                            clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                                            value: (!Ext.isEmpty(item.getValue())) ? item.getValue().toString() : null
                                        }
                                    } else if (item.xtype == 'fieldcontainer') {
                                        var fixValueField = item.getComponent('fixValueField');
                                        var expressionField = item.getComponent('expressionField');
                                        if (fixValueField.hidden == false) {
                                            result[fixValueField.getName()] = {
                                                clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                                                value: (!Ext.isEmpty(fixValueField.getValue())) ? fixValueField.getValue().toString() : null
                                            }
                                        } else {
                                            result[fixValueField.getName()] = {
                                                clazz: 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue',
                                                calculationExpression: (!Ext.isEmpty(expressionField.getValue())) ? expressionField.getValue().toString() : null
                                            }
                                        }
                                    } else {
                                        result[item.getName()] = {
                                            clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                                            value: (!Ext.isEmpty(item.getValue())) ? item.getValue().toString() : null
                                        }
                                    }
                                }
                            }
                        }
                        console.log(result);
                        return result;
                    },
                    items: [
                        {
                            xtype: 'gridcombo',
                            name: 'entryLink',
                            itemId: 'entryLink',
                            fieldLabel: i18n.getKey('作为哪条链的入口'),
                            displayField: 'linkName',
                            valueField: '_id',
                            store: me.linksStore,
                            matchFieldWidth: false,
                            multiSelect: false,
                            autoScroll: true,
                            editable: false,
                            haveReset: true,
                            width: 300,
                            hidden: !me.linkShow,
                            gridCfg: {
                                store: me.linksStore,
                                height: 280,
                                width: 350,
                                autoScroll: true,
                                //hideHeaders : true,
                                columns: [
                                    {
                                        text: i18n.getKey('id'),
                                        width: 80,
                                        dataIndex: '_id',
                                        renderer: function (value, metaData) {
                                            metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                            return value;
                                        }
                                    },
                                    {
                                        text: i18n.getKey('linkName'),
                                        flex: 1,
                                        dataIndex: 'linkName'
                                    }
                                ],
                                bbar: Ext.create('Ext.PagingToolbar', {
                                    store: me.linksStore,
                                    /*    displayInfo: true, // 是否 ? 示， 分 ? 信息
                                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息*/
                                    emptyMsg: i18n.getKey('noData')
                                })
                            },
                            listeners: {
                                afterrender: function (linkCombo) {
                                    //linkCombo.select(linkCombo.store.getAt(0));//自动选择第一项
                                    if (entryLink) {
                                        linkCombo.setValue(entryLink);
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'combo',
                            width: 300,
                            store: me.profileStore,
                            valueField: '_id',
                            readOnly: !isCanAddOrDelete,
                            fieldStyle: isCanAddOrDelete ? 'background-color:white' : 'background-color:silver',
                            displayField: 'name',
                            queryMode: 'local',
                            autoSelect: true,
                            editable: false,
                            haveReset: true,
                            name: 'attributeProfile',
                            itemId: 'attributeProfile',
                            fieldLabel: i18n.getKey('profile'),
                            listeners: {
                                afterrender: function (profileCombo) {
                                    profileCombo.select(profileCombo.store.getAt(0));//自动选择第一项
                                    if (attributeProfile) {
                                        profileCombo.setValue(attributeProfile);
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'combo',
                            width: 300,
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    'value',
                                    'display'
                                ],
                                data: property
                            }),
                            valueField: 'value',
                            readOnly: !isCanAddOrDelete,
                            fieldStyle: isCanAddOrDelete ? 'background-color:white' : 'background-color:silver',
                            displayField: 'display',
                            //value: 'Value',
                            autoSelect: true,
                            editable: false,
                            name: 'propertyName',
                            allowBlank: false,
                            itemId: 'propertyName',
                            fieldLabel: i18n.getKey('propertyName'),
                            onTriggerClick: function () {
                                var me = this;
                                var propertyContainer = me.ownerCt.ownerCt.ownerCt;
                                var currentPropertyName = me.getValue();
                                var hasUsePropertys = [];
                                for (var i = 0; i < propertyContainer.items.items.length; i++) {
                                    var container = propertyContainer.items.items[i];
                                    var propertyName = container.getComponent('attributePropertyValue').getComponent('propertyName').getValue();
                                    if (propertyName != currentPropertyName) {
                                        hasUsePropertys.push(propertyName);
                                    }
                                }
                                me.store.filterBy(function (item) {
                                    if (Ext.Array.contains(hasUsePropertys, item.get('value'))) {
                                        return false;
                                    } else {
                                        return true
                                    }
                                });
                                if (!me.readOnly && !me.disabled) {
                                    if (me.isExpanded) {
                                        me.collapse();
                                    } else {
                                        me.expand();
                                    }
                                    me.inputEl.focus();
                                }
                            },
                            listeners: {
                                change: function (field, newValue, oldValue) {
                                    var propertyValueField = field.ownerCt.getComponent('propertyValue');
                                    var booleanPropertyValueField = field.ownerCt.getComponent('booleanPropertyValue');
                                    var optionField = field.ownerCt.getComponent('optionField');
                                    var isInclude = field.ownerCt.getComponent('isInclude');
                                    var numberPropertyValue = field.ownerCt.getComponent('numberPropertyValue');
                                    booleanPropertyValueField.hide();
                                    booleanPropertyValueField.setDisabled(true);
                                    isInclude.hide();
                                    isInclude.setDisabled(true);
                                    optionField.hide();
                                    optionField.setDisabled(true);
                                    propertyValueField.hide();
                                    propertyValueField.setDisabled(true);
                                    numberPropertyValue.hide();
                                    numberPropertyValue.setDisabled(true);
                                    if (Ext.Array.contains(['EnableOption', 'HiddenOption'], newValue)) {
                                        isInclude.show();
                                        isInclude.setDisabled(false);
                                        optionField.show();
                                        optionField.setDisabled(false);
                                    } else if (Ext.Array.contains(['displayAccuracy', 'saveAccuracy'], newValue)) {
                                        numberPropertyValue.show();
                                        numberPropertyValue.setDisabled(false);
                                    } else if (newValue == 'Value') {
                                        propertyValueField.show();
                                        propertyValueField.setDisabled(false);
                                    } else {
                                        booleanPropertyValueField.show();
                                        booleanPropertyValueField.setDisabled(false);
                                    }
                                },
                                afterrender: function () {
                                    var me = this;
                                    if (propertyNameValue) {
                                        me.setValue(propertyNameValue);
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'radiogroup',
                            fieldLabel: 'isInclude',
                            itemId: 'isInclude',
                            hidden: true,
                            disabled: true,
                            allowBlank: false,
                            width: '100%',
                            name: 'isInclude',
                            items: [
                                {
                                    boxLabel: 'true',
                                    name: checkUUID + 1,
                                    inputValue: true,
                                    checked: !Ext.isEmpty(includedValue) ? (includedValue == true) : true
                                },
                                {
                                    boxLabel: 'false',
                                    name: checkUUID + 1,
                                    inputValue: false,
                                    checked: !Ext.isEmpty(includedValue) ? (includedValue == false) : false
                                }
                            ]
                        },
                        valueField,
                        optionField,
                        {
                            xtype: 'numberfield',
                            minValue: 0,
                            width: 300,
                            labelWidth: 100,
                            allowDecimals: false,
                            fieldLabel: 'propertyValue',
                            itemId: 'numberPropertyValue',
                            hidden: true,
                            name: 'value',
                            value: propertyValue,
                            disabled: true
                        },
                        {
                            xtype: 'radiogroup',
                            fieldLabel: 'propertyValue',
                            itemId: 'booleanPropertyValue',
                            width: '100%',
                            hidden: true,
                            name: 'value',
                            disabled: true,
                            items: [
                                {
                                    boxLabel: 'true',
                                    name: checkUUID,
                                    inputValue: 'true',
                                    checked: propertyValue ? (propertyValue == 'true') : true
                                },
                                {
                                    boxLabel: 'false',
                                    name: checkUUID,
                                    inputValue: 'false',
                                    checked: propertyValue ? (propertyValue == 'false') : false
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        propertyContainer.add(container);
    }
})
