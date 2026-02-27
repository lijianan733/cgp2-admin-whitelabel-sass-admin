/**
 * Created by nan on 2020/2/19.
 */
Ext.Loader.syncRequire([
    'CGP.common.field.TemplateUpload',
    'CGP.common.condition.ConditionFieldV3',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.store.PreProcessConfigStore'

]);
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.managematerialviewtypetemplateConfig.view.EditTemplateConfigWindow', {
    extend: 'Ext.window.Window',
    modal: true,
    constrain: true,
    layout: 'fit',
    createOrEdit: 'create',
    record: null,
    lastWin: null,//上一对话框
    width: 650,
    maxHeight: 650,
    data: null,//传入的数据
    mvtData: null,//materialViewType数据
    controller: null,
    grid: null,//管理界面的grid
    alias: 'widget.templateconfigwindow',
    initComponent: function () {
        var me = this;

        var productConfigDesignId = JSGetQueryString('productConfigDesignId');
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
        var isLock = builderConfigTab.isLock;
        var materialViewTypePreprocessConfigIdStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.store.PreProcessConfigStore', {
            params: {
                filter: Ext.JSON.encode([{
                    name: 'designId',
                    type: 'string',
                    value: productConfigDesignId,
                }]),
            },
        });
        me.controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.managematerialviewtypetemplateConfig.controller.Controller');
        //构建valueEx使用的上下文
        var productId = builderConfigTab.productId;
        var contentData = me.controller.buildPMVTTContentData(productId);
        me.title = i18n.getKey(me.createOrEdit) + i18n.getKey('template') + i18n.getKey('config');
        me.items = [
            {
                xtype: 'errorstrickform',
                itemId: 'form',
                autoScroll: true,
                layout: {
                    type: 'vbox',
                    align: 'center',
                    pack: 'center',
                },
                defaults: {
                    padding: '5 25 5 25',
                    width: 550,
                    allowBlank: false,
                },
                getValue: function () {
                    var form = this;
                    var result = {};
                    for (var i = 0; i < form.items.items.length; i++) {
                        var item = form.items.items[i];
                        if (item.disabled == false) {
                            if (item.name == 'palettes') {
                                var strArr = [];
                                var gridFieldValue = item.getSubmitValue();
                                for (var j = 0; j < gridFieldValue.length; j++) {
                                    strArr.push(gridFieldValue[j].value);
                                }
                                result[item.getName()] = strArr;
                            } else if (item.name == 'materialViewTypePreprocessConfigId') {
                                result[item.getName()] = item.getSubmitValue()[0];
                            } else if (item.name == 'optionProjections') {
                                result[item.getName()] = item.getSubmitValue();
                            } else {
                                result[item.getName()] = item.getValue();
                            }
                        }
                    }
                    return result;
                },
                isValid: function () {
                    var me = this;
                    var isValid = true,
                        errors = {};
                    me.msgPanel.hide();
                    me.items.items.forEach(function (f) {
                        if (!f.isValid()) {
                            errors[f.getFieldLabel()] = f.getErrors();
                            isValid = false;
                        }
                    });
                    this.showErrors(errors);
                    return isValid;
                },
                items: [
                    {
                        xtype: 'uxfieldcontainer',
                        itemId: 'groupId',
                        name: 'groupId',
                        layout: 'hbox',
                        defaults: {},
                        readOnly: true,
                        fieldStyle: '',
                        labelAlign: 'left',
                        fieldLabel: i18n.getKey('groupId'),
                        setValue: function (data) {
                            var me = this;
                            me.getComponent('groupId').setValue(data);
                        },
                        getName: function () {
                            var me = this;
                            return me.name;
                        },
                        getValue: function () {
                            var me = this;
                            return me.getComponent('groupId').getValue();
                        },
                        isValid: function () {
                            var me = this;
                            return me.getComponent('groupId').isValid();
                        },
                        getErrors: function () {
                            return '该输入项为必输项'
                        },
                        items: [
                            {
                                xtype: 'combo',
                                name: 'groupId',
                                editable: false,
                                fieldLabel: false,
                                flex: 1,
                                margin: '0 5 0 0',
                                allowBlank: false,
                                id: 'groupId',
                                itemId: 'groupId',
                                valueField: 'groupId',
                                displayField: 'groupId',
                                store: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.managematerialviewtypetemplateConfig.store.GroupIdStore', {
                                    mvtId: me.mvtData._id,
                                }),
                                listeners: {
                                    change: function (combo, newValue, oldValue) {
                                        if (!oldValue) {
                                            var templateArr = me.controller.getTemplateByGroupId(newValue);
                                            var fileType = combo.ownerCt.ownerCt.getComponent('fileType');
                                            var clazz = combo.ownerCt.ownerCt.getComponent('clazz');
                                            fileType.setReadOnly(false);
                                            fileType.setFieldStyle('background-color: white');
                                            fileType.setValue();
                                            var fileData = [
                                                {
                                                    value: 'AI',
                                                    display: 'AI',
                                                }, {
                                                    value: 'PDF',
                                                    display: 'PDF',
                                                }, {
                                                    value: 'PSD',
                                                    display: 'PSD',
                                                },
                                            ];
                                            if (templateArr.length > 0) {
                                                for (var j = 0; j < fileData.length; j++) {
                                                    block: {
                                                        for (var i = 0; i < templateArr.length; i++) {
                                                            if (templateArr[i].groupId == newValue && templateArr[i].fileType == fileData[j].value) {
                                                                fileData[j].value += '(已添加)';
                                                                fileData[j].display += '(已添加)';
                                                                break block;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            fileType.store.proxy.data = fileData;
                                            fileType.store.load();
                                        }
                                    },
                                },
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('selfCreate'),
                                width: 65,
                                handler: function () {
                                    JSGetCommonKey(true,function (key){
                                        Ext.getCmp('groupId').setValue(key);
                                    });
                                }
                            }
                        ],
                    },
                    {
                        xtype: 'combo',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'value',
                                'display',
                            ],
                            data: [
                                {
                                    value: 'AI',
                                    display: 'AI',
                                }, {
                                    value: 'PDF',
                                    display: 'PDF',
                                }, {
                                    value: 'PSD',
                                    display: 'PSD',
                                },
                            ],
                        }),
                        regex: /^(?!.*?已添加).*$/,
                        regexText: '不允许选择已添加的选项',
                        valueField: 'value',
                        displayField: 'display',
                        editable: false,
                        name: 'fileType',
                        itemId: 'fileType',
                        fieldStyle: 'background-color: silver',
                        readOnly: true,
                        fieldLabel: i18n.getKey('file') + i18n.getKey('type'),
                        diySetValue: function (data) {
                            if (data) {
                                var me = this;
                                me.setReadOnly(true);
                                me.setFieldStyle('background-color: silver');
                                me.setValue(data);
                            }
                        },
                    },
                    {
                        xtype: 'combo',
                        name: 'clazz',
                        itemId: 'clazz',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'value',
                                'display',
                            ],
                            data: [
                                {
                                    value: 'com.qpp.cgp.domain.preprocess.template.PreprocessTemplateConfig',
                                    display: '预处理模板',
                                }, {
                                    value: 'com.qpp.cgp.domain.preprocess.template.DynamicSizeProductMaterialViewTypeTemplateConfig',
                                    display: '可变尺寸模板',
                                }, {
                                    value: 'com.qpp.cgp.domain.preprocess.template.StaticProductMaterialViewTypeTemplateConfig',
                                    display: '静态尺寸模板',
                                },

                            ],
                        }),
                        mapping: {
                            common: [
                                'groupId', 'fileType', 'clazz', 'isCheck',
                            ],
                            'com.qpp.cgp.domain.preprocess.template.DynamicSizeProductMaterialViewTypeTemplateConfig': [
                                'standard', 'standardValueEx', 'palettes', 'isExclude', 'dpi', 'variables', 'fileName', 'optionProjections',
                            ],
                            'com.qpp.cgp.domain.preprocess.template.StaticProductMaterialViewTypeTemplateConfig': [
                                'uploadFileName', 'fileUrl', 'md5',
                            ],
                            'com.qpp.cgp.domain.preprocess.template.PreprocessTemplateConfig': [
                                'fileName', 'materialViewTypePreprocessConfigId',
                            ],

                        },
                        valueField: 'value',
                        displayField: 'display',
                        editable: false,
                        fieldLabel: i18n.getKey('template') + i18n.getKey('type'),
                        listeners: {
                            change: function (combo, newValue, oldValue) {
                                var form = combo.ownerCt;
                                for (var i = 0; i < form.items.items.length; i++) {
                                    var item = form.items.items[i];
                                    if (Ext.Array.contains(combo.mapping['common'], item.getName())) {
                                        //不处理
                                    } else if (Ext.Array.contains(combo.mapping[newValue], item.getName())) {
                                        item.show();
                                        item.setDisabled(false);
                                    } else {
                                        item.setDisabled(true);
                                        item.hide();
                                    }

                                }
                            },
                        },
                    },
                    {//固定模板使用上传组件
                        xtype: 'templatefield',
                        id: 'uploadFileName',
                        name: 'uploadFileName',
                        fieldLabel: i18n.getKey('fileName'),
                        itemId: 'uploadFileName',
                        allowBlank: false,
                        formFileName: 'file',
                        fileType: me.data.fileType,
                        url: imageServer + 'upload',
                        callBack: function (fp, action) {
                            var sucFile = action.response.data;
                            var fileName = '', wind = fp.owner.ownerCt;
                            if (sucFile) {
                                fileName = sucFile.originalFileName;
                                for (var i = 0; i < window.parent.length; i++) {
                                    if (window.parent[i].Ext.getCmp('uploadFileName')) {
                                        window.parent[i].Ext.getCmp('uploadFileName').setValue(fileName.substring(0, fileName.lastIndexOf('.')));
                                        window.parent[i].Ext.getCmp('uploadFileName').ownerCt.getComponent('fileUrl').setValue(sucFile.url);
                                        window.parent[i].Ext.getCmp('uploadFileName').ownerCt.getComponent('md5').setValue(sucFile.fileName);
                                        break;
                                    }
                                }
                                wind.close();
                            }
                        },
                        getErrors: function () {
                            return ['不予许为空'];
                        },
                    },
                    {
                        xtype: 'textfield',
                        name: 'fileName',
                        itemId: 'fileName',
                        allowBlank: false,
                        fieldLabel: i18n.getKey('fileName'),
                    },
                    {
                        xtype: 'checkbox',
                        name: 'isCheck',
                        itemId: 'isCheck',
                        inputValue: true,
                        fieldLabel: i18n.getKey('校验模板尺寸'),
                    },
                    {
                        name: 'materialViewTypePreprocessConfigId',
                        itemId: 'materialViewTypePreprocessConfigId',
                        valueField: '_id',
                        displayField: 'description',
                        editable: false,
                        fieldLabel: i18n.getKey('预处理配置'),
                        xtype: 'gridcombo',
                        haveReset: true,
                        allowBlank: false,
                        store: materialViewTypePreprocessConfigIdStore,
                        matchFieldWidth: false,
                        gridCfg: {
                            height: 280,
                            width: 700,
                            viewConfig: {
                                enableTextSelection: true,
                            },
                            columns: [{
                                text: i18n.getKey('id'),
                                dataIndex: '_id',
                                itemId: '_id',
                            }, {
                                text: i18n.getKey('description'),
                                dataIndex: 'description',
                                itemId: 'description',
                            }, {
                                text: i18n.getKey('目标MVT'),
                                dataIndex: 'targetMaterialViewType',
                                itemId: 'targetMaterialViewType',
                                width: 250,
                                renderer: function (value, metadata, record) {
                                    return value.description + '(' + value._id + ')';
                                },
                            }, {
                                text: i18n.getKey('源MVT'),
                                dataIndex: 'sourceMaterialViewTypes',
                                itemId: 'sourceMaterialViewTypes',
                                flex: 1,
                                renderer: function (value, metadata, record) {
                                    var result = '';
                                    if (value) {
                                        for (var i = 0; i < value.length; i++) {
                                            result += value[i].description + '(' + value[i]._id + '),';
                                            if (i % 2 != 0) {
                                                result += '<br>'
                                            }

                                        }
                                    }
                                    return result;
                                },
                            }],
                            bbar: Ext.create('Ext.PagingToolbar', {
                                store: materialViewTypePreprocessConfigIdStore,
                                displayInfo: true, // 是否 ? 示， 分 ? 信息
                                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                                emptyMsg: i18n.getKey('noData'),
                            }),
                        },
                        diySetValue: function (data) {
                            var me = this;
                            me.setInitialValue(data);
                        }
                    },
                    {
                        xtype: 'textfield',
                        itemId: 'standard',
                        allowBlank: true,
                        fieldLabel: i18n.getKey('standard'),
                        name: 'standard',
                    },
                    {
                        xtype: 'valueexfield',
                        itemId: 'standardValueEx',
                        fieldLabel: i18n.getKey('standardValueEx'),
                        name: 'standardValueEx',
                        allowBlank: true,
                        uxTextareaContextData: true,
                        defaultValueConfig: {
                            type: 'String',
                            typeSetReadOnly: true,
                        },
                    },
                    {
                        xtype: 'checkbox',
                        name: 'isExclude',
                        itemId: 'isExclude',
                        inputValue: true,
                        fieldLabel: i18n.getKey('isExclude'),
                    },
                    {
                        xtype: 'numberfield',
                        name: 'dpi',
                        itemId: 'dpi',
                        inputValue: true,
                        minValue: 0,
                        allowDecimals: false,//禁用小数
                        fieldLabel: i18n.getKey('dpi'),
                    },
                    {
                        xtype: 'uxfieldcontainer',
                        defaults: {},
                        labelAlign: 'left',
                        fieldLabel: i18n.getKey('variables'),
                        name: 'variables',
                        itemId: 'variables',
                        layout: 'fit',
                        getValue: function () {
                            var me = this;
                            return me.getComponent('variables').getValue();
                        },
                        setValue: function (data) {
                            var me = this;
                            var variablesBtn = me.getComponent('variables');
                            variablesBtn.rawData = data;
                        },
                        isValid: function () {
                            var me = this;
                            var variables = me.getComponent('variables');
                            if (me.disabled == false) {
                                if (variables.rawData) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                return true;
                            }

                        },
                        getErrors: function () {
                            return ['不予许为空'];
                        },
                        items: [
                            {
                                xtype: 'button',
                                name: 'variables',
                                itemId: 'variables',
                                rawData: null,
                                text: i18n.getKey('edit'),
                                getValue: function () {
                                    var me = this;
                                    return me.rawData;
                                },
                                setVale: function (data) {
                                    var me = this;
                                    me.rawData = data;
                                },
                                getName: function () {
                                    return this.name;
                                },
                                handler: function (variableBtn) {
                                    Ext.create('Ext.ux.window.ShowJsonDataWindowV2', {
                                        height: 620,
                                        editable: true,
                                        showValue: true,
                                        isHiddenRawDateForm: true,
                                        rawData: variableBtn.rawData,
                                        title: i18n.getKey('edit') + i18n.getKey('variables'),
                                        bbar: [
                                            '->',
                                            {
                                                xtype: 'button',
                                                text: i18n.getKey('confirm'),
                                                iconCls: 'icon_agree',
                                                handler: function (btn) {
                                                    var win = btn.ownerCt.ownerCt;
                                                    variableBtn.rawData = btn.ownerCt.ownerCt.getValue();
                                                    win.close();
                                                },
                                            },
                                            {
                                                xtype: 'button',
                                                text: i18n.getKey('cancel'),
                                                iconCls: 'icon_cancel',
                                                handler: function (btn) {
                                                    var win = btn.ownerCt.ownerCt;
                                                    win.close();
                                                },
                                            },
                                        ],
                                    }).show();

                                },
                            },
                        ],
                    },
                    {
                        xtype: 'arraydatafield',
                        name: 'palettes',
                        itemId: 'palettes',
                        fieldLabel: i18n.getKey('palettes'),
                        maxHeight: 120,
                        matchFieldWidth: true,
                        resultType: 'Array'
                    },
                    {
                        xtype: 'textfield',
                        name: 'md5',
                        itemId: 'md5',
                        fieldLabel: i18n.getKey('md5'),
                        readOnly: true,
                        allowBlank: true,
                        fieldStyle: 'background-color: silver',

                    },
                    {
                        xtype: 'textfield',
                        name: 'fileUrl',
                        itemId: 'fileUrl',
                        fieldLabel: i18n.getKey('fileUrl'),
                        vtype: 'url',
                        readOnly: true,
                        fieldStyle: 'background-color: silver',
                    },
                    {
                        xtype: 'gridfieldwithcrud',
                        name: 'optionProjections',
                        itemId: 'optionProjections',
                        fieldLabel: i18n.getKey('optionProjections'),
                        gridConfig: {
                            maxHeight: 300,
                            viewConfig: {
                                enableTextSelection: true,
                            },
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    {
                                        name: 'clazz',
                                        type: 'string',
                                        defaultValue: 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.OptionProjectionGroup',
                                    },
                                    {name: 'condition', type: 'object'},
                                    {name: 'conditionDTO', type: 'object'},
                                    {name: 'projection', type: 'object'},
                                ],
                                data: [],
                            }),
                            columns: [
                                {
                                    text: i18n.getKey('condition'),
                                    dataIndex: 'condition',
                                    xtype: 'valueexcomponentcolumn',
                                    readOnly: true,
                                    canChangeValue: false,//是否可以通过编辑改变record的
                                    flex: 1,
                                },
                                {
                                    text: i18n.getKey('projection'),
                                    dataIndex: 'projection',
                                    xtype: 'componentcolumn',
                                    flex: 1,
                                    renderer: function (value, metadata, record) {
                                        metadata.tdAttr = 'data-qtip="查看projection"';
                                        return {
                                            xtype: 'displayfield',
                                            value: '<a href="#")>查看</a>',
                                            listeners: {
                                                render: function (display) {
                                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                    ela.on("click", function () {
                                                        JSShowJsonDataV2(value, '查看projection')
                                                    });
                                                },
                                            },
                                        };
                                    },
                                },
                            ],
                        },
                        allowBlank: true,
                        minHeight: 80,
                        formConfig: {
                            isValidForItems: true,//是否校验时用item.forEach来处理
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

                                //对conditionDTO字段进行处理，用改字段生成condition字段,如果以前有旧数据,使用以前的
                                //如果是使用conditionDTO组件，再期其清空数据时，把condition也做清除
                                var conditionDTO = form.getComponent('conditionDTO');
                                if (conditionDTO.hidden == false) {
                                    if (data.conditionDTO) {
                                        data.condition = conditionDTO.getExpression();
                                    } else {
                                        data.condition = null;
                                    }
                                } else {
                                    data.conditionDTO = null;
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
                        setValueHandler: function (data) {
                            var win = this;
                            //本来应该是去修改组件获取数据的方法，使它们获取到的数据每次都是个独立的对象，使之修改获取到的数据不会互相影响
                            data = Ext.clone(data);
                            var form = win.getComponent('form');
                            form.items.items.forEach(function (item) {
                                if (item.disabled == false) {
                                    if (item.diySetValue) {
                                        item.diySetValue(data[item.getName()]);
                                    } else {
                                        item.setValue(data[item.getName()]);
                                    }
                                }
                            })

                            //对数据进行处理
                            var condition = form.getComponent('condition');
                            var conditionDTO = form.getComponent('conditionDTO');
                            if (data.conditionDTO) {
                                //如果有配置conditionDto，则显示新的条件组件，否则使用旧的
                                conditionDTO.show();
                                conditionDTO.setDisabled(false);
                                condition.hide();
                                condition.setDisabled(true);
                            } else {
                                if (Ext.isEmpty(data.condition)) {
                                    //两个都没配置使用新的组件
                                    conditionDTO.show();
                                    conditionDTO.setDisabled(false);
                                    condition.hide();
                                    condition.setDisabled(true);
                                } else {
                                    condition.show();
                                    condition.setDisabled(false);
                                    conditionDTO.hide();
                                    conditionDTO.setDisabled(true);
                                }
                            }
                        },
                        formItems: [
                            {
                                xtype: 'valueexfield',
                                fieldLabel: i18n.getKey('condition'),
                                name: 'condition',
                                width: 500,
                                itemId: 'condition',
                                allowBlank: true,
                                hidden: true,
                                commonPartFieldConfig: {
                                    defaultValueConfig: {
                                        type: 'Boolean',
                                        typeSetReadOnly: true,
                                    },
                                },
                            },
                            {
                                xtype: 'conditionfieldv3',
                                fieldLabel: i18n.getKey('condition'),
                                name: 'conditionDTO',
                                width: 500,
                                allowBlank: false,
                                contentData: contentData,
                                itemId: 'conditionDTO',
                            },
                            {
                                xtype: 'gridfieldwithcrud',
                                fieldLabel: i18n.getKey('projection'),
                                name: 'projection',
                                itemId: 'projection',
                                minHeight: 80,
                                width: 500,
                                gridConfig: {
                                    maxHeight: 300,
                                    renderTo: JSGetUUID(),
                                    store: {
                                        xtype: 'store',
                                        fields: [
                                            {name: 'key', type: 'string'},
                                            {name: 'value', type: 'object'},
                                        ],
                                        data: [],
                                    },
                                    columns: [
                                        {
                                            text: i18n.getKey('key'),
                                            dataIndex: 'key',
                                            flex: 1,
                                        },
                                        {
                                            text: i18n.getKey('value'),
                                            dataIndex: 'value',
                                            flex: 1,
                                            xtype: 'valueexcomponentcolumn',
                                            readOnly: true,
                                            canChangeValue: false,//是否可以通过编辑改变record的
                                        },
                                    ],
                                },
                                formItems: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: i18n.getKey('key'),
                                        name: 'key',
                                        itemId: 'key',
                                    },
                                    {
                                        xtype: 'valueexfield',
                                        fieldLabel: i18n.getKey('value'),
                                        name: 'value',
                                        itemId: 'value',
                                    },
                                ],

                                /**
                                 * 对象转数组显示
                                 */
                                diySetValue: function (value) {
                                    var me = this;
                                    var arrData = [];
                                    for (var i in value) {
                                        arrData.push({
                                            key: i,
                                            value: value[i],
                                        })
                                    }
                                    me.setSubmitValue(arrData);
                                },
                                /**
                                 * 把数组转成对象存储
                                 */
                                diyGetValue: function () {
                                   ;
                                    var me = this;
                                    var arrData = me.getSubmitValue();
                                    var objData = {};
                                    for (var i = 0; i < arrData.length; i++) {
                                        objData[arrData[i].key] = arrData[i].value;
                                    }
                                    return objData;


                                },
                            },
                        ],
                        diySetValue: function (data) {
                            var me = this;
                            me.setSubmitValue(data);
                        }
                    },
                ],
                bbar: {
                    hidden: isLock,
                    items: [
                        '->',
                        {
                            xtype: 'button',
                            iconCls: 'icon_agree',
                            text: i18n.getKey('confirm'),
                            handler: function (btn) {
                                var form = btn.ownerCt.ownerCt;
                                var win = form.ownerCt;
                                var result = {};
                                if (form.isValid()) {
                                    result = form.getValue();
                                    if (result.clazz == 'com.qpp.cgp.domain.preprocess.template.DynamicSizeProductMaterialViewTypeTemplateConfig') {
                                        var stander = form.getComponent('standard');
                                        var standerEx = form.getComponent('standardValueEx');
                                        if (Ext.isEmpty(stander.getValue()) && Ext.isEmpty(standerEx.getValue())) {
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('standard和standardValueEx至少一个有值'));
                                            return false;
                                        }
                                    }
                                    if (result.uploadFileName) {
                                        result.fileName = result.uploadFileName;
                                        delete result.uploadFileName;
                                    }
                                    win.controller.saveTemplateConfig(win, result, win.mvtData, win.createOrEdit, win.grid);
                                }
                            },
                        },
                        {
                            xtype: 'button',
                            iconCls: 'icon_cancel',
                            text: i18n.getKey('cancel'),
                            handler: function (btn) {
                                btn.ownerCt.ownerCt.ownerCt.close();
                            },
                        },
                    ],

                },
            },
        ];
        me.callParent();
    },
    listeners: {
        afterrender: function (win) {
            var data = {}
            if (win.createOrEdit == 'create') {
                data.clazz = "com.qpp.cgp.domain.preprocess.template.PreprocessTemplateConfig";
            } else {
                data = win.data;
            }
            var form = win.getComponent('form');
            for (var i = 0; i < form.items.items.length; i++) {
                var item = form.items.items[i];
                //有值
                if (!Ext.isEmpty(data[item.getName()])) {
                    if (item.getName() == 'materialViewTypePreprocessConfigId') {
                        item.setInitialValue([data[item.getName()]]);
                    } else if (item.getName() == 'optionProjections') {
                        item.setSubmitValue(data[item.getName()]);
                    } else if (item.name == 'uploadFileName') {
                        item.setValue(data['fileName']);
                    } else {
                        if (item.diySetValue) {
                            item.diySetValue(data[item.getName()]);
                        } else {
                            item.setValue(data[item.getName()]);
                        }
                    }
                }
            }
        },
    },
})
