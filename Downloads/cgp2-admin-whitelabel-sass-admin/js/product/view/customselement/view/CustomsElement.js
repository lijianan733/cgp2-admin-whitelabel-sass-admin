/**
 * Created by nan on 2018/9/5.
 * 报关要素
 * 可配置产品默认全部显示
 * sku产品中，报关分类
 * Y:必填
 * S:无货号，不能修改
 * N:空,不能修改，
 * Y>S>N
 * 统计所有报关分类中的各个项，有一个Y就以Y为准，否则以S为准，不然以N
 */
Ext.define('CGP.product.view.customselement.view.CustomsElement', {
    extend: 'Ext.ux.form.Panel',
    title: i18n.getKey('customsElements'),
    defaults: {
        margin: '10 50 5 0'
    },
    productId: null,
    recordId: null,
    itemId: 'CustomsElement',
    createOrEdit: 'create',
    isSkuProduct: true,
    readyLoadData: false,//是否加载完数据
    parentConfigProductId: null,//父可配置产品Id
    createForm: function () {
        var me = this,
            cfg = {},
            props = me.basicFormConfigs,
            len = props.length,
            i = 0,
            prop;
        for (; i < len; ++i) {
            prop = props[i];
            cfg[prop] = me[prop];
        }
        var model = [];
        if (Ext.isString(me.model))
            model.push(me.model);
        else if (Ext.isArray(me.model))
            model = me.model;
        cfg.model = model;
        //重写表单的校验
        cfg.isValid = function () {
            this.owner.msgPanel.hide();
            var isValid = true;
            var errors = {};
            if (this.owner.getComponent('outCustoms').getValue() == false) {
                //不在校验其他元素
                return true
            }
            if (Ext.isEmpty(this.owner.getComponent('outCustoms').getValue())) {
                //没有选择时，只校验该元素
                errors[i18n.getKey(this.owner.getComponent('outCustoms').getName())] = this.owner.getComponent('outCustoms').getErrors();
                this.showErrors(errors);
                return false
            }
            this.getFields().items.forEach(function (item) {
                if (!item.isValid()) {
                    var itemName = item.getName();
                    if (itemName == 'size' || itemName == 'customsCategory') {
                        errors[i18n.getKey(itemName)] = item.getErrors();
                    } else {
                        errors[item.getFieldLabel()] = item.getErrors();
                    }
                    isValid = false;
                }
            });
            var customsElements = this.owner.getComponent('customsCategoryFieldcontainer').getComponent('diyCustomsCategory');
            if (!customsElements.hidden) {
                var customsElementsValue = customsElements.getValue();
                if (Ext.isEmpty(customsElementsValue)) {
                    errors[this.owner.getComponent('customsCategoryFieldcontainer').getFieldLabel()] = '自定义报关分类策略必须经编辑';
                    isValid = false;
                }
            }
            var size = this.owner.getComponent('sizeDescFieldcontainer').getComponent('diySize');
            if (!size.hidden) {
                var sizeValue = size.getValue();
                if (Ext.isEmpty(sizeValue)) {
                    errors[this.owner.getComponent('sizeDescFieldcontainer').getFieldLabel()] = '自定义尺寸策略必须经编辑';
                    isValid = false;
                }
            }
            if (isValid == false) {
                this.showErrors(errors);
            }
            return isValid;
        }
        return new Ext.ux.form.Basic(me, cfg);
    },
    constructor: function (config) {
        var me = this;
        var store = Ext.create("CGP.customscategory.store.CustomsCategory");
        me.customCategoryStore = Ext.create("CGP.product.view.customselement.store.CustomCategoryStore", {
            productId: config.productId
        });
        var applyConfig = Ext.Object.merge({
            columnCount: 1,
            items: [
                {
                    name: 'outCustoms',
                    xtype: 'combo',
                    itemId: 'outCustoms',
                    fieldLabel: i18n.getKey('isOutCustoms'),
                    allowBlank: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [
                            {
                                name: i18n.getKey('true'),
                                value: true
                            },
                            {
                                name: i18n.getKey('false'),
                                value: false
                            }
                        ]
                    }),
                    valueField: 'value',
                    value: false,
                    displayField: 'name',
                    editable: false,
                    listeners: {
                        'change': function (view, newVlaue, oldValue) {
                            var form = view.ownerCt;
                            for (var i = 0; i < form.items.items.length; i++) {
                                var field = form.items.items[i];
                                if (field.getName() != 'outCustoms') {
                                    field.setDisabled(!newVlaue);
                                    if (newVlaue) {
                                        field.show();
                                    } else {
                                        field.hide();
                                    }
                                }
                            }
                            var gridField = view.ownerCt.getComponent('customsCategoryFieldcontainer').getComponent('customsCategory');
                            var selectRecords = [];
                            var data = gridField.getArrayValue();
                            if (Ext.isEmpty(data)) {
                                return
                            }
                            for (var i = 0; i < data.length; i++) {
                                var model = new gridField.store.model();
                                for (var j in data[i]) {
                                    model.set(j, data[i][j]);
                                }
                                selectRecords.push(model);
                            }
                            if (newVlaue != false) {
                                if (!gridField.hidden && !Ext.isEmpty(gridField.getValue())) {
                                    gridField.getPicker().grid.fireEvent('selectionchange',
                                        gridField.getPicker().grid.selModel,
                                        selectRecords
                                    )
                                }
                            }
                        }
                    }
                },
                {
                    name: 'alonePacking',
                    xtype: 'combo',
                    disabled: true,
                    itemId: 'alonePacking',
                    fieldLabel: i18n.getKey('isAlonePacking'),
                    allowBlank: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [
                            {
                                name: i18n.getKey('true'),
                                value: true
                            },
                            {
                                name: i18n.getKey('false'),
                                value: false
                            }
                        ]
                    }),
                    valueField: 'value',
                    displayField: 'name',
                    editable: false

                },
                {
                    name: 'piecesDesc',
                    xtype: 'numberfield',
                    itemId: 'piecesDesc',
                    disabled: true,
                    fieldLabel: i18n.getKey('pieces'),
                    allowBlank: true,
                    minValue: 1,
                    allowDecimals: false//不允许小数点
                },
                {
                    xtype: 'uxfieldcontainer',
                    layout: 'hbox',
                    labelAlign: 'right',
                    defaults: {},
                    disabled: true,
                    allowBlank: false,
                    name: 'customsCategory',
                    itemId: 'customsCategoryFieldcontainer',
                    fieldLabel: i18n.getKey('customsCategory'),
                    getValue: function () {
                        var me = this;
                        if (me.getComponent('customsCategory').hidden) {
                            return me.getComponent('diyCustomsCategory').getValue();
                        } else {
                            return {
                                clazz: 'com.qpp.cgp.value.ConstantValue',
                                type: 'Array',
                                value: Ext.JSON.encode(me.getComponent("customsCategory").getSubmitValue())
                            }
                        }
                    },
                    setValue: function (value) {
                        var me = this;
                        var customsElementPanel = me.ownerCt;
                        //仅当数据为确定值类型，且数据类型为Array时使用gridcombo展示
                        if (value.clazz == 'com.qpp.cgp.value.ConstantValue' && value.type == 'Array') {
                            var checkBox = me.getComponent('customsCategory').getPicker().grid.getDockedItems('toolbar[dock="top"]')[0].getComponent('isConfirmType');
                            if (value.value.split(',').length > 1) {
                                checkBox.setValue(false);
                            }
                            if (Ext.isEmpty(value.value)) {
                                return;
                            }
                            var value = Ext.JSON.decode(value.value).toString();
                            //区分情况1.gridstore加载了没，customsCategory加载了没
                            if (me.getComponent('customsCategory').store.isLoading()) {
                                me.getComponent('customsCategory').store.on('load', function () {
                                    if (customsElementPanel.customCategoryStore.isLoading()) {
                                        customsElementPanel.customCategoryStore.on('load', function (store, records) {
                                            var data = [];
                                            for (var i = 0; i < records.length; i++) {
                                                data.push(records[i].getData());
                                            }
                                            me.getComponent('customsCategory').setValue(data);
                                        }, this, {
                                            single: true
                                        })
                                    } else {
                                        var data = [];
                                        for (var i = 0; i < customsElementPanel.customCategoryStore.data.items.length; i++) {
                                            var record = customsElementPanel.customCategoryStore.data.items[i];
                                            data.push(record.getData());
                                        }
                                        me.getComponent('customsCategory').setValue(data);
                                    }
                                }, this, {
                                    single: true
                                })
                            } else {
                                if (customsElementPanel.customCategoryStore.isLoading()) {
                                    customsElementPanel.customCategoryStore.on('load', function (store, records) {
                                        var data = [];
                                        for (var i = 0; i < records.length; i++) {
                                            data.push(records[i].getData());
                                        }
                                        me.getComponent('customsCategory').setValue(data);
                                    }, this, {
                                        single: true
                                    })
                                } else {
                                    var data = [];
                                    for (var i = 0; i < customsElementPanel.customCategoryStore.data.items.length; i++) {
                                        var record = customsElementPanel.customCategoryStore.data.items[i];
                                        data.push(record.getData());
                                    }
                                    me.getComponent('customsCategory').setValue(data);
                                }
                            }
                            me.getComponent('customsCategory').show();
                            me.getComponent('customsCategory').setDisabled(false);
                            me.getComponent('diyCustomsCategory').hide();
                            me.getComponent('diyCustomsCategory').setDisabled(true);
                        } else {
                            me.getComponent('diyCustomsCategory').setValue(value);
                            me.getComponent('diyCustomsCategory').show();
                            me.getComponent('diyCustomsCategory').setDisabled(false);
                            me.getComponent('customsCategory').hide();
                            me.getComponent('customsCategory').setDisabled(true);
                        }
                    },
                    items: [
                        {
                            name: 'customsCategory',
                            xtype: 'gridcombo',
                            flex: 4,
                            editable: false,
                            displayField: 'outName',
                            valueField: '_id',
                            store: store,
                            multiSelect: true,
                            pickerAlign: 'bl',
                            isHiddenCheckSelected: false,
                            itemId: 'customsCategory',
                            allowBlank: false,
                            matchFieldWidth: false,
                            gridCfg: {
                                store: store,
                                height: 300,
                                width: 700,
                                selType: 'checkboxmodel',
                                multiSelect: true,
                                viewConfig: {
                                    enableTextSelection: true,
                                    stripeRows: true
                                },
                                columns: [
                                    {
                                        text: i18n.getKey('id'),
                                        dataIndex: '_id',
                                        flex: 1
                                    },
                                    {
                                        text: i18n.getKey('TagkeyCode'),
                                        dataIndex: 'tagKeyCode',
                                        flex: 1,
                                        renderer: function (value, metadata) {
                                            metadata.tdAttr = 'data-qtip=' + value;
                                            return value;
                                        }
                                    },
                                    {
                                        text: i18n.getKey('inCustoms') + i18n.getKey('customsDeclaration') + i18n.getKey('name'),
                                        flex: 1,
                                        dataIndex: 'inName',
                                        renderer: function (value, metadata) {
                                            metadata.tdAttr = 'data-qtip=' + value;
                                            return value;
                                        }
                                    },
                                    {
                                        text: i18n.getKey('inCustoms') + i18n.getKey('customsDeclaration') + i18n.getKey('id'),
                                        flex: 1,
                                        dataIndex: 'inCode',
                                        renderer: function (value, metadata) {
                                            metadata.tdAttr = 'data-qtip=' + value;
                                            return value;
                                        }
                                    },
                                    {
                                        text: i18n.getKey('outCustoms') + i18n.getKey('customsDeclaration') + i18n.getKey('name'),
                                        flex: 1,
                                        dataIndex: 'outName',
                                        renderer: function (value, metadata) {
                                            metadata.tdAttr = 'data-qtip=' + value;
                                            return value;
                                        }
                                    },
                                    {
                                        text: i18n.getKey('outCustoms') + i18n.getKey('customsDeclaration') + i18n.getKey('id'),
                                        flex: 1,
                                        dataIndex: 'outCode',
                                        renderer: function (value, metadata) {
                                            metadata.tdAttr = 'data-qtip=' + value;
                                            return value;
                                        }
                                    }
                                ],
                                tbar: {
                                    layout: {
                                        type: 'table',
                                        columns: '4'
                                    },
                                    border: true,
                                    items: [
                                        {
                                            xtype: 'checkbox',
                                            colspan: 4,
                                            name: 'isConfirmType',
                                            itemId: 'isConfirmType',
                                            inputValue: 'true',
                                            checked: false,
                                            boxLabel: i18n.getKey('classifyIsConfirm')
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: i18n.getKey('TagkeyCode'),
                                            labelAlign: 'right',
                                            isLike: false,
                                            name: 'tagKeyCode'
                                        },
                                        {
                                            xtype: 'textfield',
                                            name: 'outName',
                                            labelAlign: 'right',
                                            fieldLabel: i18n.getKey('outCustoms') + i18n.getKey('customsDeclaration') + i18n.getKey('name')
                                        },
                                        {
                                            xtype: 'button',
                                            text: i18n.getKey('query'),
                                            handler: function (view) {
                                                me.btnSearch(view);
                                            }
                                        },
                                        {
                                            xtype: 'button',
                                            text: i18n.getKey('clear'),
                                            handler: function (view) {
                                                me.clearSearch(view);
                                            }
                                        }
                                    ]
                                },
                                bbar: Ext.create('Ext.PagingToolbar', {
                                    store: store,
                                    displayInfo: true,
                                    displayMsg: '',
                                    emptyMsg: i18n.getKey('noData')
                                })
                            },
                            listeners: {
                                'afterrender': function (gridCombo) {
                                    //在gridCombo渲染完时，在gird中无法获取到外围的组件，因为grid是一个浮动组件,故使用store来传递事件信号
                                    var checkBox = gridCombo.getPicker().grid.getDockedItems('toolbar[dock="top"]')[0].getComponent('isConfirmType');
                                    var grid = gridCombo.getPicker().grid;
                                    checkBox.on('change', function (view, newValue, oldValue) {
                                        //动态更改选择模式
                                        if (newValue == true) {
                                            grid.getView().getSelectionModel().setSelectionMode('SINGLE');
                                            gridCombo.multiSelect = false;
                                            gridCombo.clearValue();
                                            if (grid.rendered) {
                                                grid.getView().getSelectionModel().deselectAll();
                                            }
                                        } else {
                                            grid.getView().getSelectionModel().setSelectionMode('SIMPLE');
                                            gridCombo.multiSelect = true;
                                            gridCombo.clearValue();
                                            if (grid.rendered) {
                                                grid.getView().getSelectionModel().deselectAll();
                                            }
                                        }
                                    });
                                    checkBox.setValue(true);
                                    //监听grid的change事件
                                    gridCombo.getPicker().grid.on('selectionchange', function (selectModel, records) {
                                        //是否为sku产品，后根据选择报关类型对其他组件进行控制
                                        //可配置产品，不做任何约束
                                        //有父可配置产品的sku产品，不允许修改
                                        //无父可配置产品的sku产品，不做任何约束
                                        if (me.isSkuProduct && !Ext.isEmpty(me.parentConfigProductId)) {
                                            //统计所选的报关分类中的是否显示品牌，型号，货号，款号
                                            var isShowBrand = 'N'; //是否显示品牌
                                            var isShowModel = 'N';//是否显示型号
                                            var isShowFreightNum = 'N';//是否显示货号
                                            var isShowStyleNum = 'N';//是否显示款号
                                            var brandDesc = me.getComponent('brandDesc');//品牌
                                            var styleDesc = me.getComponent('styleDesc');//型号
                                            var cargoNo = me.getComponent('cargoNo');//货号
                                            var patternNo = me.getComponent('patternNo');//款号
                                            var filedArray = [brandDesc, styleDesc, cargoNo, patternNo];
                                            var valueArray = ['brand', 'model', 'cargoNo', 'patternNo'];
                                            if (records.length == 0) {
                                                filedArray.forEach(function (item) {
                                                    item.hide();
                                                });
                                                return;
                                            } else {
                                                filedArray.forEach(function (item) {
                                                    item.show();
                                                });
                                            }
                                            //遍历所有数据，统计4项类型的结果
                                            for (var i = 0; i < records.length; i++) {
                                                var record = records[i];
                                                if (isShowBrand != 'Y') {
                                                    isShowBrand = record.get('showBrand');
                                                }
                                                if (isShowModel != 'Y') {
                                                    isShowModel = record.get('showModel');
                                                }
                                                if (isShowFreightNum != 'Y') {
                                                    isShowFreightNum = record.get('showFreightNum')
                                                }
                                                if (isShowStyleNum != 'Y') {
                                                    isShowStyleNum = record.get('showStyleNum');
                                                }
                                                //当4个类型的值都为Y时，不再循环
                                                if (isShowBrand + isShowModel + isShowFreightNum + isShowStyleNum == 'YYYY') {
                                                    break;
                                                }
                                            }

                                            //为4个字段设置约束，Y为自定义必填项,S为固定无XX,N为NULL值
                                            me.setLabelInfo(isShowBrand, isShowModel, isShowFreightNum, isShowStyleNum);
                                            var statusArray = [isShowBrand, isShowModel, isShowFreightNum, isShowStyleNum];
                                            for (var i = 0; i < filedArray.length; i++) {
                                                var item = filedArray[i];
                                                var labelValue = null;
                                                if (statusArray[i] == 'S') {
                                                    labelValue = i18n.getKey('without') + i18n.getKey(valueArray[i]);
                                                }
                                                item.setValue(labelValue);
                                                item.isValid();
                                            }
                                        }
                                    })

                                }
                            }
                        },
                        {
                            xtype: 'button',
                            hidden: true,
                            value: null,
                            getValue: function () {
                                var me = this;
                                return me.value;
                            },
                            setValue: function (value) {
                                var me = this;
                                me.value = value;
                            },
                            itemId: 'diyCustomsCategory',
                            text: i18n.getKey('compile'),
                            flex: 4,
                            handler: function (button) {
                                var valueEx = Ext.create('CGP.common.valueExV3.GroupGridTab', {
                                    itemId: 'diyCustomsCategoryWindow',
                                    listeners: {
                                        'afterrender': function (view) {
                                            view.getFormPanel().form.getFields().items[0].setValue('com.qpp.cgp.value.ExpressionValueEx');//设置初始的type
                                            view.getFormPanel().form.getFields().items[1].setValue('Array');//设置初始的数据类型
                                            if (button.value) {
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
                                    layout: 'fit',
                                    width: '60%',
                                    height: '70%',
                                    title: i18n.getKey('compile'),
                                    items: [valueEx],
                                    bbar: [
                                        '->',
                                        {
                                            xtype: 'button',
                                            text: i18n.getKey('confirm'),
                                            iconCls: 'icon_agree',
                                            handler: function (btn) {
                                                var formPanel = btn.ownerCt.ownerCt.getComponent('diyCustomsCategoryWindow').getFormPanel();
                                                var gridPanelValue = btn.ownerCt.ownerCt.getComponent('diyCustomsCategoryWindow').getGridPanelValue();
                                                var formPanelValue = btn.ownerCt.ownerCt.getComponent('diyCustomsCategoryWindow').getFormPanelValue();
                                                formPanelValue.constraints = gridPanelValue;
                                                if (!formPanel.isValid()) {
                                                    return
                                                } else {
                                                    if (formPanelValue.clazz == 'com.qpp.cgp.value.ExpressionValueEx' && Ext.isEmpty(formPanelValue.expression)) {
                                                        Ext.Msg.alert(i18n.getKey('prompt'), '基本信息中的表达式不能为空！')
                                                    } else {
                                                        button.value = formPanelValue;
                                                        win.close();
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'button',
                                            text: i18n.getKey('cancel'),
                                            iconCls: 'icon_cancel',
                                            handler: function (btn) {
                                                win.close();
                                            }
                                        }
                                    ]
                                });
                                win.show();
                            }
                        },
                        {
                            xtype: 'splitter'
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('switch') + i18n.getKey('inputView'),
                            flex: 2,
                            hidden: config.isSkuProduct,
                            handler: function (view) {
                                if (view.ownerCt.getComponent('customsCategory').hidden) {
                                    view.ownerCt.getComponent('customsCategory').show();
                                    view.ownerCt.getComponent('customsCategory').setDisabled(false);
                                    view.ownerCt.getComponent('diyCustomsCategory').hide();
                                    view.ownerCt.getComponent('diyCustomsCategory').setDisabled(true);
                                } else {
                                    view.ownerCt.getComponent('customsCategory').hide();
                                    view.ownerCt.getComponent('customsCategory').setDisabled(true);
                                    view.ownerCt.getComponent('diyCustomsCategory').show();
                                    view.ownerCt.getComponent('diyCustomsCategory').setDisabled(false);
                                }
                            }
                        }
                    ]
                },
                {
                    name: 'patternNo',
                    xtype: 'textfield',
                    itemId: 'patternNo',
                    disabled: true,
                    fieldLabel: i18n.getKey('patternNo'),
                    allowBlank: true/*,
                    value: i18n.getKey('without') + i18n.getKey('patternNo')*/
                },
                {
                    name: 'cargoNo',
                    xtype: 'textfield',
                    itemId: 'cargoNo',
                    disabled: true,
                    fieldLabel: i18n.getKey('cargoNo'),
                    allowBlank: true/*,
                    value: i18n.getKey('without') + i18n.getKey('cargoNo')*/
                },
                {
                    name: 'styleDesc',
                    xtype: 'textfield',
                    itemId: 'styleDesc',
                    disabled: true,
                    fieldLabel: i18n.getKey('model'),
                    allowBlank: true/*,
                    value: i18n.getKey('without') + i18n.getKey('model')*/
                },
                {
                    name: 'brandDesc',
                    xtype: 'textfield',
                    itemId: 'brandDesc',
                    disabled: true,
                    fieldLabel: i18n.getKey('brand'),
                    allowBlank: true/*,
                    value: i18n.getKey('without') + i18n.getKey('brand')*/
                },
                {
                    xtype: 'uxfieldcontainer',
                    layout: 'hbox',
                    disabled: true,
                    labelAlign: 'right',
                    defaults: {},
                    name: 'sizeDesc',
                    itemId: 'sizeDescFieldcontainer',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('size'),
                    getValue: function () {
                        var me = this;
                        if (me.getComponent('sizeDesc').hidden) {
                            return me.getComponent('diySize').getValue();
                        } else {
                            return {
                                clazz: 'com.qpp.cgp.value.ConstantValue',
                                type: 'String',
                                value: me.getComponent('sizeDesc').getValue()

                            }
                        }
                    },
                    setValue: function (value) {
                        var me = this;
                        if (value.clazz == 'com.qpp.cgp.value.ConstantValue') {
                            me.getComponent('sizeDesc').setValue(value.value);
                            me.getComponent('sizeDesc').show();
                            me.getComponent('sizeDesc').setDisabled(false);
                            me.getComponent('diySize').hide();
                            me.getComponent('diySize').setDisabled(true);
                        } else {
                            me.getComponent('diySize').setValue(value);
                            me.getComponent('diySize').show();
                            me.getComponent('diySize').setDisabled(false);
                            me.getComponent('sizeDesc').hide();
                            me.getComponent('sizeDesc').setDisabled(true);
                        }
                    },
                    items: [
                        {
                            name: 'sizeDesc',
                            xtype: 'textfield',
                            flex: 4,
                            itemId: 'sizeDesc',
                            allowBlank: false
                        },
                        {
                            xtype: 'button',
                            hidden: true,
                            itemId: 'diySize',
                            value: null,
                            getValue: function () {
                                var me = this;
                                return me.value;
                            },
                            setValue: function (value) {
                                var me = this;
                                me.value = value;
                            },
                            text: i18n.getKey('compile'),
                            flex: 4,
                            handler: function (button) {
                                var valueEx = Ext.create('CGP.common.valueExV3.GroupGridTab', {
                                    itemId: 'diySizeWindow',
                                    listeners: {
                                        'afterrender': function (view) {
                                            view.getFormPanel().form.getFields().items[0].setValue('com.qpp.cgp.value.ExpressionValueEx');//设置初始的type
                                            view.getFormPanel().form.getFields().items[1].setValue('Array');//设置初始的数据类型
                                            if (button.value) {
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
                                    layout: 'fit',
                                    width: '60%',
                                    height: '70%',
                                    title: i18n.getKey('compile'),
                                    items: [valueEx],
                                    bbar: [
                                        '->',
                                        {
                                            xtype: 'button',
                                            text: i18n.getKey('confirm'),
                                            iconCls: 'icon_agree',
                                            handler: function (btn) {
                                                var formPanel = btn.ownerCt.ownerCt.getComponent('diySizeWindow').getFormPanel();
                                                var gridPanelValue = btn.ownerCt.ownerCt.getComponent('diySizeWindow').getGridPanelValue();
                                                var formPanelValue = btn.ownerCt.ownerCt.getComponent('diySizeWindow').getFormPanelValue();
                                                formPanelValue.constraints = gridPanelValue;
                                                if (!formPanel.isValid()) {
                                                    return
                                                } else {
                                                    if (formPanelValue.clazz == 'com.qpp.cgp.value.ExpressionValueEx' && Ext.isEmpty(formPanelValue.expression)) {
                                                        Ext.Msg.alert(i18n.getKey('prompt'), '基本信息中的表达式不能为空！')
                                                    } else {
                                                        button.value = formPanelValue;
                                                        win.close();
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'button',
                                            text: i18n.getKey('cancel'),
                                            iconCls: 'icon_cancel',
                                            handler: function (btn) {
                                                win.close();
                                            }
                                        }
                                    ]
                                });
                                win.show();
                            }
                        },
                        {
                            xtype: 'splitter'
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('switch') + i18n.getKey('inputView'),
                            flex: 2,
                            hidden: config.isSkuProduct,
                            handler: function (view) {
                                if (view.ownerCt.getComponent('sizeDesc').hidden) {
                                    view.ownerCt.getComponent('sizeDesc').show();
                                    view.ownerCt.getComponent('sizeDesc').setDisabled(false);
                                    view.ownerCt.getComponent('diySize').hide();
                                    view.ownerCt.getComponent('diySize').setDisabled(true);

                                } else {
                                    view.ownerCt.getComponent('sizeDesc').hide();
                                    view.ownerCt.getComponent('sizeDesc').setDisabled(true);
                                    view.ownerCt.getComponent('diySize').show();
                                    view.ownerCt.getComponent('diySize').setDisabled(false);
                                }
                            }
                        }
                    ]
                }
            ]
        }, config);
        me.tbar = [
            {
                xtype: 'button',
                iconCls: 'icon_save',
                text: i18n.getKey('save'),
                handler: function (btn) {
                    var data = me.getValue();
                    if (data) {
                        me.saveValue(data);
                    }
                }
            }
        ];
        me.callParent([applyConfig]);
        me.on('afterrender', function () {
            var page = this;
            var productId = page.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    },
    validateForm: function () {
        var me = this;
        if (!me.readyLoadData) {
            me.on('readyLoadData', function () {
                me.isValid();
            })
            me.setFormValue();
        } else {
            return me.isValid();
        }
    },
    getValue: function () {
        var me = this;
        if (me.validateForm()) {
            var value = {};
            me.items.items.forEach(function (item) {
                if (!item.disabled) {
                    value[item.getName()] = item.getValue();
                }
            });
            return value;
        }
    },
    setValue: function (data) {
        var me = this;
        //设置值1时对产品类型进行设置，不同的类型操作需求不同
        for (var i = 0; i < me.items.items.length; i++) {
            var field = me.items.items[i];
            if (!Ext.isEmpty(data[field.getName()])) {
                field.setValue(data[field.getName()]);
            }
        }
    },
    copy: function (data) {
        var me = this;
        me.getComponent('id').setValue("");
        data.id = null;
    },
    saveValue: function (data) {
        var me = this;
        var url = adminPath + 'api/customsElement';
        var method = 'POST'
        if (me.createOrEdit == 'edit') {
            method = 'PUT';
            url = adminPath + 'api/customsElement/' + me.recordId;
        }
        var productId = me.productId;
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: Ext.Object.merge(data, {
                productId: productId,
                clazz: 'com.qpp.cgp.domain.customs.CustomsElement'
            }),
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    },
    /**
     *
     * @param btn
     */
    btnSearch: function (btn) {
        var query = [];
        var items = btn.ownerCt.items.items;
        var store = btn.ownerCt.ownerCt.getStore();
        for (var i = 0; i < items.length; i++) {
            //gridCombo中添加了查看已选功能
            if (items[i].xtype != 'checkbox' && items[i].xtype != 'button' && items[i].xtype != 'tbfill' && !Ext.isEmpty(items[i].getValue())) {
                var filter = {};
                filter.value = "%" + items[i].getValue() + "%";
                filter.name = items[i].name;
                filter.type = 'string';
                query.push(filter);
            }
        }
        if (!Ext.isEmpty(query)) {
            store.proxy.extraParams = {
                filter: Ext.JSON.encode(query)
            };
        } else {
            store.proxy.extraParams = null;
        }
        store.loadPage(1);
    },
    /**
     *
     * @param btn
     */
    clearSearch: function (btn) {
        var items = btn.ownerCt.items.items;
        var store = btn.ownerCt.ownerCt.getStore();
        for (var i = 0; i < items.length; i++) {
            if (items[i].xtype == 'button' || items[i].xtype == 'tbfill') {
                continue;
            }
            items[i].setValue(null);
        }
        store.proxy.extraParams = null;
    },
    /**
     *
     * @param view
     */
    setFormValue: function (view) {
        var me = this;
        if (Ext.isEmpty(me.productId)) {
            return;
        }
        me.on('afterLoadAllRecord', me.setLabelInfo);
        Ext.create('CGP.product.view.customselement.store.CustomsElementStore', {
            params: {
                filter: Ext.JSON.encode([
                    {
                        name: 'productId',
                        type: 'number',
                        value: me.productId
                    }
                ])
            },
            listeners: {
                load: function (store, records) {
                    if (records.length == 0) {
                        me.readyLoadData = true;
                        me.fireEvent('readyLoadData');
                    } else {
                        me.setValue(records[0].getData());
                        me.createOrEdit = 'edit';
                        me.recordId = records[0].getId();
                        //sku产品且有父可配置产品才需要对选择的额报关分类进行统计,
                        if (records[0].get('outCustoms')) {
                            if (records[0].get('customsCategory').clazz == 'com.qpp.cgp.value.ConstantValue' && me.isSkuProduct && !Ext.isEmpty(me.parentConfigProductId)) {
                                var recordIdArray = Ext.JSON.decode(records[0].get('customsCategory').value);
                                var isShowBrand = 'N'; //是否显示品牌
                                var isShowModel = 'N';//是否显示型号
                                var isShowFreightNum = 'N';//是否显示货号
                                var isShowStyleNum = 'N';//是否显示款号
                                var successCount = 0;
                                for (var i = 0; i < recordIdArray.length; i++) {
                                    CGP.customscategory.model.CustomsCategory.load(recordIdArray[i], {
                                        scope: this,
                                        failure: function (record, operation) {
                                        },
                                        success: function (record, operation) {
                                            if (isShowBrand != 'Y') {
                                                isShowBrand = record.get('showBrand');
                                            }
                                            if (isShowModel != 'Y') {
                                                isShowModel = record.get('showModel');
                                            }
                                            if (isShowFreightNum = 'Y') {
                                                isShowFreightNum = record.get('showFreightNum')
                                            }
                                            if (isShowStyleNum != 'Y') {
                                                isShowStyleNum = record.get('showStyleNum');
                                            }
                                            successCount++;
                                            if (successCount == recordIdArray.length) {
                                                me.fireEvent('afterLoadAllRecord', isShowBrand, isShowModel, isShowFreightNum, isShowStyleNum)
                                            }
                                        },
                                        callback: function (record, operation) {
                                        }
                                    })
                                }
                            }
                        }
                        me.readyLoadData = true;
                        me.fireEvent('readyLoadData');
                    }
                }
            }
        })
    },
    /**
     * 设置4个标签的信息,
     * 为4个字段设置约束
     */
    setLabelInfo: function (isShowBrand, isShowModel, isShowFreightNum, isShowStyleNum) {
        var me = this;
        var brandDesc = me.getComponent('brandDesc');//品牌
        var styleDesc = me.getComponent('styleDesc');//型号
        var cargoNo = me.getComponent('cargoNo');//货号
        var patternNo = me.getComponent('patternNo');//款号
        var filedArray = [brandDesc, styleDesc, cargoNo, patternNo];
        var valueArray = ['brand', 'model', 'cargoNo', 'patternNo'];
        var statusArray = [isShowBrand, isShowModel, isShowFreightNum, isShowStyleNum];
        for (var i = 0; i < filedArray.length; i++) {
            var item = filedArray[i];
            if (statusArray[i] == 'Y') {
                item.setDisabled(false);
                item.setReadOnly(false);
                item.allowBlank = false;
                item.setFieldStyle('background-color: white');
                item.labelSeparator = ':<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>';
            } else if (statusArray[i] == 'S') {
                item.allowBlank = false;
                item.setReadOnly(true);
                item.setFieldStyle('background-color: silver');
                item.labelSeparator = ':';
            } else if (statusArray[i] == 'N') {
                item.setFieldStyle('background-color: silver');
                item.setReadOnly(true);
                item.allowBlank = true;
                item.labelSeparator = ':';
            }
            item.setFieldLabel(i18n.getKey(valueArray[i]));
            item.isValid();
        }
    },

    listeners: {
        'afterrender': function (view) {
            var me = this;
            //初始化界面，隐藏除了是否报关外的其他组件
            for (var i = 0; i < me.items.items.length; i++) {
                var field = me.items.items[i];
                if (field.getName() != 'outCustoms') {
                    field.hide();
                }
            }
            view.setFormValue();
        }
    }
})

