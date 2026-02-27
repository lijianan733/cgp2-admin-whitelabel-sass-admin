/**
 * Created by nan on 2020/6/5.
 */
Ext.Loader.syncRequire([
    'CGP.rtattribute.model.Attribute',
    'CGP.common.field.RtTypeSelectField'
]);
Ext.onReady(function () {
    var recordId = parseInt(JSGetQueryString('id'));
    var createOrEdit = recordId ? 'edit' : 'create';
    var controller = Ext.create('CGP.rtattribute.controller.Controller');
    var localAttributeOptionStore = Ext.create("CGP.rtattribute.store.AttributesOptions");
    var page = Ext.widget({
        i18nblock: 'RtAttributeDef',
        block: 'rtattribute',
        xtype: 'uxeditpage',
        gridPage: 'main.html',
        createOrEdit: createOrEdit,
        recordId: recordId,
        recordData: null,
        outTabsId: 'tabs',
        tbarCfg: {
            btnCreate: {
                handler: function (btn) {
                    var toolbar = btn.ownerCt;
                    var uxEditPage = btn.ownerCt.ownerCt.ownerCt;
                    var items = uxEditPage.form.items.items;
                    var options = uxEditPage.form.getComponent('options');
                    if (options._grid) {
                        options._grid.getStore().removeAll();
                    }
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        item.reset();
                    }
                    uxEditPage.createOrEdit == 'create';
                    uxEditPage.recordId = null;
                    if (uxEditPage.outTabsId) {
                        var tabs = top.Ext.getCmp(uxEditPage.outTabsId);
                        if (tabs) {
                            var editPageId = uxEditPage.block + '_edit';//管理页面的id
                            var editPage = tabs.getComponent(editPageId);
                            if (editPage) {
                                editPage.setTitle(i18n.getKey('create') + '_' + i18n.getKey(uxEditPage.i18nblock));
                            }
                        }
                    }
                }
            },
            btnCopy: {
                handler: function (btn) {
                    var toolbar = btn.ownerCt;
                    var uxEditPage = btn.ownerCt.ownerCt.ownerCt;
                    uxEditPage.createOrEdit == 'create';
                    uxEditPage.recordId = null;
                    if (uxEditPage.outTabsId) {
                        var tabs = top.Ext.getCmp(uxEditPage.outTabsId);
                        if (tabs) {
                            var editPageId = uxEditPage.block + '_edit';//管理页面的id
                            var editPage = tabs.getComponent(editPageId);
                            if (editPage) {
                                editPage.setTitle(i18n.getKey('create') + '_' + i18n.getKey(uxEditPage.i18nblock));
                            }
                        }
                    }
                }
            },
            btnSave: {
                handler: function (btn) {
                    var toolbar = btn.ownerCt;
                    var uxEditPage = btn.ownerCt.ownerCt.ownerCt;
                    if (uxEditPage.form.isValid()) {
                        uxEditPage.el.mask();
                        uxEditPage.updateLayout();
                        var data = uxEditPage.form.diyGetValue();
                        var model = new CGP.rtattribute.model.Attribute(data);
                        controller.saveRtAttributeDef(model.getData(), uxEditPage);
                        toolbar.buttonCreate.enable();
                        toolbar.buttonCopy.enable();
                    }
                }
            },
            btnReset: {
                handler: function (btn) {
                    var toolbar = btn.ownerCt;
                    var uxEditPage = btn.ownerCt.ownerCt.ownerCt;
                    var form = uxEditPage.form;
                    var options = form.getComponent('options');

                    if (uxEditPage.recordData) {
                        form.diySetValue(uxEditPage.recordData);
                    } else {
                        var items = form.items.items;
                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];
                            item.reset();
                        }
                    }
                }
            }
        },
        formCfg: {
            layout: {
                layout: 'table',
                columns: 1,
                tdAttrs: {
                    style: {
                        'padding-right': '120px'
                    }
                }
            },
            queryParam: '2333',//不使用自动加载数据
            diyGetValue: function () {
                var me = this;
                var result = {};
                for (var i = 0; i < me.items.items.length; i++) {
                    var item = me.items.items[i];
                    if (item.disabled == false) {
                        if (item.itemId == 'options') {
                            result[item.getName()] = item.getSubmitValue();
                        } else if (item.getName() == 'code' || item.getName() == 'name') {
                            result[item.getName()] = item.getValue().trim();
                        } else {
                            result[item.getName()] = item.getValue();
                        }
                    }
                }
                if (Ext.isEmpty(result.options)) {
                    result.options = [];
                }
                if (!Ext.isEmpty(result.customType)) {
                    result.customType = {
                        clazz: "com.qpp.cgp.domain.bom.attribute.RtType",
                        _id: result.customType
                    }
                }
                if (result.selectType == 'MULTI') {//多选的默认值格式为'[1,2,3]'
                    if (result.valueDefault) {
                        if (result.valueType == 'String') {
                            result.valueDefault = result.valueDefault.map(function (item) {
                                return '"' + item + '"';
                            })
                        }
                        result.valueDefault = '[' + result.valueDefault.toString() + ']'
                    }
                }
                return result;
            },
            diySetValue: function (data) {
                var me = this;
                me.ownerCt.recordData = Ext.clone(data);
                if (data.selectType == 'MULTI') {//多选的默认值格式为'[1,2,3]'
                    if (data.valueDefault) {
                        data.valueDefault = data.valueDefault.replace(/[\[|\]]/g, '');
                        if (data.valueType == 'String') {
                            data.valueDefault = data.valueDefault.split(',');
                            data.valueDefault = data.valueDefault.map(function (item) {
                                return item.replace(/"/g, '');
                            })
                        } else if (data.valueType == 'Number' || data.valueType == 'int') {
                            data.valueDefault = data.valueDefault.split(',');
                            data.valueDefault = data.valueDefault.map(function (item) {
                                return item.replace(/"/g, '');
                            })
                        }
                    }
                }
                var items = me.items.items;
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (!Ext.isEmpty(data[item.getName()])) {
                        if (item.itemId == 'valueDefault') {
                            item.setValue(data)
                        } else if (item.itemId == 'customType') {
                            item.setInitialValue([data.customType._id]);
                        } else if (item.itemId == 'options') {
                            item.setSubmitValue(data[item.getName()]);
                        } else {
                            item.setValue(data[item.getName()]);
                        }
                    }
                }
            },
            useForEach: true,
            items: [
                {
                    name: 'code',
                    xtype: 'textfield',
                    // regex: /^\S+.*\S+$/,
                    // regexText: '值的首尾不能存在空格！',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('code'),
                    itemId: 'code'
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    // regex: /^\S+.*\S+$/,
                    // regexText: '值的首尾不能存在空格！',
                    fieldLabel: i18n.getKey('name'),
                    allowBlank: false,
                    itemId: 'name'
                },
                {
                    name: 'valueType',
                    xtype: 'combo',
                    editable: false,
                    allowBlank: false,
                    itemId: 'valueType',
                    id: 'valueType',
                    value: 'String',//默认string
                    fieldLabel: i18n.getKey('valueType'),
                    store: Ext.create('CGP.rtattribute.store.ValueType', {
                        listeners: {
                            load: function (store) {
                                store.filterBy(function (item) {
                                    if (Ext.Array.contains(['Array'], item.get('code'))) {
                                        return false;
                                    } else {
                                        return true
                                    }
                                });
                            }
                        }
                    }),
                    displayField: 'code',
                    valueField: 'code',
                    changeCount: 0,//改变的次数，用于区分第一次赋值和改变值
                    listeners: {
                        "change": function (combo, newValue, oldValue) {
                            combo.changeCount++;
                            //值类型为customType时，不需要选择输入方式，显示ArrayType
                            var uxEditPage = combo.ownerCt.ownerCt;
                            var valueDefault = combo.ownerCt.getComponent('valueDefault');
                            var arrayType = combo.ownerCt.getComponent('arrayType');
                            var selectType = combo.ownerCt.getComponent('selectType');
                            var customType = combo.ownerCt.getComponent('customType');
                            var options = combo.ownerCt.getComponent('options');
                            if (newValue == 'CustomType') {
                                arrayType.show();
                                selectType.hide();
                                options.hide();
                                options.setDisabled(true);
                                customType.show();
                                customType.setDisabled(false);
                                valueDefault.setActiveItem(newValue);
                            } else {
                                customType.hide();
                                customType.setDisabled(true);
                                arrayType.hide();
                                selectType.show();
                                if (selectType.getValue() == 'NON' || Ext.isEmpty(selectType.getValue())) {
                                    valueDefault.setActiveItem(newValue);
                                    options.hide();
                                    options.setDisabled(true);
                                } else {
                                    valueDefault.setActiveItem('options', selectType.getValue() == 'MULTI');
                                    options.show();
                                    options.getGrid().getView().refresh();
                                    options.setDisabled(false);
                                    if (options.getGrid().store.getCount() > 0 && combo.changeCount > 1) {//选项类型数据里面已经有数据了,newValue不为空，处理reset，oldValue不能为空处理初始化
                                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('选项中已有配置数据，是否清空选项中已有数据?'), function (selector) {
                                            if (selector == 'yes') {
                                                options.setSubmitValue([]);
                                                valueDefault.activeItem.reset();
                                            }
                                        })
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    editable: false,
                    name: 'selectType',
                    xtype: 'combo',
                    displayField: 'name',
                    valueField: 'value',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [
                            {name: '输入型', value: 'NON'},
                            {name: '单选型', value: 'SINGLE'},
                            {name: '多选型', value: 'MULTI'}
                        ]
                    }),
                    fieldLabel: i18n.getKey('selectType'),
                    itemId: 'selectType',
                    allowBlank: false,
                    value: 'NON',
                    listeners: {
                        "change": function (combo, newValue, oldValue) {
                            var optionGrid = combo.ownerCt.getComponent('options');
                            var valueDefault = combo.ownerCt.getComponent('valueDefault');
                            var valueType = combo.ownerCt.getComponent('valueType');
                            var arrayType = combo.ownerCt.getComponent('arrayType');
                            if (newValue == 'NON') {
                                optionGrid.hide();
                                optionGrid.setDisabled(true);
                            } else if (newValue == 'MULTI' || newValue == 'SINGLE') {
                                optionGrid.show();
                                if (optionGrid.getGrid()) {
                                    optionGrid.getGrid().getView().refresh();
                                }
                                optionGrid.setDisabled(false);
                            }
                            if (newValue == 'MULTI') {
                                arrayType.setValue('Array');
                            } else {
                                arrayType.setValue('NON');
                            }
                            if (newValue == 'NON') {
                                valueDefault.setActiveItem(valueType.getValue());
                            } else {
                                valueDefault.setActiveItem('options', newValue == 'MULTI');
                            }

                        }
                    }
                },
                {
                    name: 'options',
                    xtype: 'gridfieldwithcrud',
                    fieldLabel: i18n.getKey('options'),
                    itemId: 'options',
                    hidden: true,
                    disabled: true,
                    allowBlank: false,
                    autoRender: true,
                    gridConfig: {
                        height: 300,
                        width: 600,
                        renderTo: 'optionsGrid',
                        viewConfig: {
                            enableTextSelection: true
                        },
                        valueSource: 'storeProxy',
                        store: localAttributeOptionStore,
                        columns: [
                            {
                                text: i18n.getKey('name'),
                                sortable: false,
                                dataIndex: 'name',
                                flex: 1,
                                id: 'optionsname',
                                renderer: function (value, metadata, record) {
                                    metadata.tdAttr = 'data-qtip=' + value;
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('value'),
                                sortable: false,
                                dataIndex: 'value',
                                flex: 1,
                                renderer: function (value, metadata, record) {
                                    metadata.tdAttr = 'data-qtip=' + value;
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('sortOrder'),
                                dataIndex: 'sortOrder',
                                flex: 1,
                                sortable: false
                            },
                            {
                                text: i18n.getKey('type'),
                                dataIndex: 'name',
                                sortable: false,
                                renderer: function (value, metadata, record) {
                                    return record.getId() ? i18n.getKey('advance') : i18n.getKey('custom');
                                }
                            }
                        ]
                    },
                    formItems: [
                        {
                            xtype: 'hiddenfield',
                            name: 'id',
                        },
                        {
                            xtype: 'numberfield',
                            labelWidth: 80,
                            name: 'sortOrder',
                            readOnly: true,
                            fieldLabel: i18n.getKey('sortOrder'),
                            itemId: 'sortOrder',
                            listeners: {
                                afterrender: function (field) {
                                    var outGrid = field.ownerCt.ownerCt.outGrid;
                                    if (outGrid.record) {
                                    } else {//新建时的值
                                        field.setValue((outGrid.store.max('sortOrder') ?? 0) + 1);
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('name'),
                            labelWidth: 80,
                            name: 'name',
                            diyGetValue: function () {
                                return this.getValue().trim();
                            },
                            itemId: 'name',
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('displayValue'),
                            labelWidth: 80,
                            name: 'displayValue',
                            diyGetValue: function (comp) {
                                return this.getValue().trim();
                            },
                            itemId: 'displayValue',
                        }
                    ],
                    beforeOpenEditWindowHandler: function () {
                        var me = this;
                        var valueType = me.ownerCt.getComponent('valueType').getValue();
                        var valueDefault = null;
                        if (valueType == 'Number' || valueType == 'int') {
                            valueDefault = {
                                xtype: 'numberfield',
                                itemId: 'numberfield',
                                allowDecimals: true,
                                allowExponential: false,
                                decimalPrecision: 8//8位小数
                            }

                        } else if (valueType == 'String') {
                            valueDefault = {
                                xtype: 'textarea',
                                height: 100,
                                itemId: 'stringValue'
                            }
                        } else if (valueType == 'Boolean') {
                            valueDefault = {
                                xtype: 'combo',
                                valueField: 'value',
                                itemId: 'booleanValue',
                                displayField: 'display',
                                editable: false,
                                store: Ext.create('Ext.data.Store', {
                                    fields: [
                                        {
                                            name: 'value',
                                            type: 'boolean'
                                        }, 'display'],
                                    data: [
                                        {
                                            display: 'true',
                                            value: true
                                        },
                                        {
                                            display: 'false',
                                            value: false
                                        }
                                    ]
                                })
                            }
                        } else if (valueType == 'Date') {
                            valueDefault = {
                                xtype: 'datetimefield',
                                itemId: 'dateValue',
                                format: 'Y-m-d H:i:s',
                                editable: false
                            }
                        }
                        valueDefault.fieldLabel = i18n.getKey('value');
                        valueDefault.name = 'value';
                        valueDefault.labelWidth = 80;
                        valueDefault.itemId = 'value';
                        me.formItems.push(valueDefault);
                        //根据选择的valueType确定输入值组件的类型

                    },
                    addHandler: function (btn, e) {
                        if (!btn.menu) {
                            var grid = btn.ownerCt.ownerCt;
                            btn.menu = Ext.create('Ext.menu.Menu', {
                                id: 'addmenu',
                                items: [
                                    {
                                        text: i18n.getKey('advance') + i18n.getKey('options'),
                                        handler: function () {
                                            controller.advanceOptionWind(grid);
                                        }
                                    },
                                    {
                                        text: i18n.getKey('tag') + i18n.getKey('options'),
                                        handler: function () {
                                            controller.addTagOption(grid);
                                        }
                                    },
                                    {
                                        text: i18n.getKey('custom') + i18n.getKey('options'),
                                        handler: function (menubtn) {
                                            controller.customOptionWind(grid);
                                        }
                                    },
                                ]
                            });
                            btn.menu.showBy(btn);
                        }
                    },
                    saveHandler: function (btn) {
                        var form = btn.ownerCt.ownerCt;
                        var win = form.ownerCt;
                        if (form.isValid()) {
                            var data = {}, existeName = '';
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
                            //检测是否有已添加
                            for (var i = 0; i < win.outGrid.store.getCount(); i++) {
                                var item = win.outGrid.store.getAt(i);
                                var existNameLength = 0;
                                if (Ext.isEmpty(data.id)) {
                                    if (item.get('name') == data.name) {
                                        existNameLength += existNameLength;
                                        if(existNameLength > 1){
                                            existeName = item.get('name') + ' ;';
                                        }
                                    }
                                } else {
                                    if (item.get('id') != data.id && item.get('name') == data.name) {
                                        existeName = item.get('name') + ' ;';
                                    }
                                }
                            }
                            if (existeName) {
                                Ext.Msg.alert('提示', '以下rtOption名称已存在不能重复添加！\n ' + existeName);
                                return false;
                            }
                            if (win.createOrEdit == 'create') {
                                win.outGrid.store.add(data);
                            } else {
                                for (var i in data) {
                                    if(!(i == 'id' && Ext.isEmpty(data['id']))){
                                        win.record.set(i, data[i]);
                                    }
                                }
                            }
                            win.close();
                        }
                    }
                },
                {
                    name: 'valueDefault',
                    xtype: 'uxfieldcontainer',
                    itemId: 'valueDefault',
                    layout: {
                        type: 'auto',
                    },
                    defaults: {
                        name: 'valueDefault',
                        disabled: true,
                        hidden: true,
                        width: 380,
                        fieldLabel: i18n.getKey('valueDefault'),
                    },
                    activeItem: null,//当前活动的组件
                    setValue: function (data) {
                        var me = this;
                       
                        var valueType = data.valueType;
                        var selectType = data.selectType;
                        var activeItem = null;
                        if (selectType == 'NON') {//输入型
                            if (valueType == 'String') {
                                activeItem = me.getComponent('stringValue');
                            } else if (valueType == 'Number' || valueType == 'int') {
                                activeItem = me.getComponent('numberValue');
                            } else if (valueType == 'Boolean') {
                                activeItem = me.getComponent('booleanValue');
                            } else if (valueType == 'Date') {
                                activeItem = me.getComponent('dateValue');
                            } else if (valueType == 'CustomType') {//这种类型其实没有默认值，这是冗余数据
                                return;
                            }
                        } else {//选项型
                            activeItem = me.getComponent('optionsValue');
                        }
                        activeItem.setValue(data['valueDefault']);
                    },
                    getValue: function () {
                       ;
                        var me = this;
                        var result = null;
                        if (me.activeItem && me.activeItem.disabled == false) {
                            result = me.activeItem.getValue();
                        }
                        return result;
                    },
                    items: [
                        {
                            xtype: 'textarea',
                            itemId: 'stringValue',
                            width: 700,
                            height: 200,
                            hidden: false,
                            disabled: false
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'numberValue',
                            allowDecimals: true,
                            allowExponential: false,
                            decimalPrecision: 8//8位小数
                        },
                        {
                            xtype: 'combo',
                            itemId: 'booleanValue',
                            displayField: 'display',
                            valueField: 'value',
                            editable: false,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['value', 'display'],
                                data: [
                                    {
                                        display: 'true',
                                        value: true
                                    },
                                    {
                                        display: 'false',
                                        value: false
                                    }
                                ]
                            })
                        },
                        {
                            xtype: 'datetimefield',
                            allowBlank: false,
                            itemId: 'dateValue',
                            format: 'Y-m-d H:i:s'
                        },
                        {
                            xtype: 'multicombobox',
                            valueField: 'value',
                            displayField: 'name',
                            queryMode: 'local',
                            itemId: 'optionsValue',
                            editable: false,
                            store: localAttributeOptionStore
                        }
                    ],
                    reset: function () {
                        var me = this;
                        for (var i = 0; i < me.items.items.length; i++) {
                            me.items.items[i].reset();
                        }
                    },
                    setActiveItem: function (valueType, multi) {
                        var me = this;
                        me.suspendLayouts();
                        var activeItem = null;
                        for (var i = 0; i < me.items.items.length; i++) {
                            var item = me.items.items[i];
                            item.hide();
                            item.setDisabled(true);
                        }
                        if (valueType == 'String') {
                            activeItem = me.getComponent('stringValue');
                        } else if (valueType == 'Number' || valueType == 'int') {
                            activeItem = me.getComponent('numberValue');
                        } else if (valueType == 'Boolean') {
                            activeItem = me.getComponent('booleanValue');
                        } else if (valueType == 'Date') {
                            activeItem = me.getComponent('dateValue');
                        } else if (valueType == 'options') {
                            activeItem = me.getComponent('optionsValue');
                            if (activeItem.multiSelect != multi) {
                                activeItem.setValue();
                            }
                            activeItem.multiSelect = multi;
                            if (multi) {
                                activeItem.multiSelect = true;
                                activeItem.getPicker().getSelectionModel().allowDeselect = true;
                                activeItem.getPicker().getSelectionModel().setSelectionMode('SIMPLE');
                            } else {
                                activeItem.multiSelect = false;
                                activeItem.getPicker().getSelectionModel().allowDeselect = false;
                                activeItem.getPicker().getSelectionModel().setSelectionMode('SINGLE');
                            }
                            if (activeItem.getPicker()) {//已经渲染
                                activeItem.getPicker().refresh();
                            }
                        }
                        if (activeItem) {
                            activeItem.show();
                            activeItem.setDisabled(false);
                        }
                        me.resumeLayouts();
                        me.doLayout();
                        me.activeItem = activeItem;
                        return activeItem;
                    },
                    listeners: {
                        afterrender: function (fieldContainer) {
                            var me = this;
                            me.activeItem = fieldContainer.getComponent('stringValue');
                        }
                    }
                },
                {
                    xtype: 'rttypeselectfield',
                    fieldLabel: i18n.getKey('customType'),
                    itemId: 'customType',
                    name: 'customType',
                    hidden: true,
                    disabled: true,
                    allowBlank: false,
                },
                {//仅在customType时显示
                    editable: false,
                    name: 'arrayType',
                    hidden: true,
                    xtype: 'combo',
                    store: Ext.create('CGP.rtattribute.store.ArrayType'),
                    displayField: 'code',
                    valueField: 'code',
                    fieldLabel: i18n.getKey('arrayType'),
                    itemId: 'arrayType',
                    allowBlank: false,
                    value: 'NON'
                }
            ]
        },
        listeners: {
            afterrender: function () {
                var me = this;
                console.log(me);
                if (recordId) {
                    CGP.rtattribute.model.Attribute.load(recordId, {
                        scope: this,
                        failure: function (record, operation) {
                        },
                        success: function (record, operation) {
                            var data = record.getData();
                            me.form.diySetValue(data);
                        },
                        callback: function (record, operation) {
                        }
                    })
                }
            }
        }
    });
});

