/**
 * @Description:条件 - 值结构的表单 xxx条件下返回xxx值
 * @author nan
 * @date 2023/5/31
 */
Ext.Loader.syncRequire([
    'CGP.common.conditionv2.view.ConditionFieldContainer',
    'CGP.common.conditionv2.view.ValueFieldV2'
])
Ext.define('CGP.common.conditionv2.view.KeyToConditionForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.key_to_condition_form',
    isValidForItems: true,
    contextStore: null,
    contextData: null,
    defaults: {
        width: '100%',
        margin: '5 25'
    },
    layout: 'vbox',
    //返回值相关配置,这三个配置必须逻辑一致，多选的返回值一定是Array
    selectType: 'NON',
    valueType: 'String',
    attrOptions: null,

    outputValueFieldConfig: null,//输出值的组件配置
    conditionFieldConfig: null,//条件组件配置
    initComponent: function () {
        var me = this;
        me.contextStore = me.contextStore || Ext.data.StoreManager.get('contextStore');
        me.items = [
            {
                xtype: 'hiddenfield',
                name: 'clazz',
                itemId: 'clazz',
                value: 'IfCondition'
            },
            Ext.Object.merge({
                xtype: 'valuefieldv2',
                itemId: 'statement',
                name: 'statement',
                fieldLabel: i18n.getKey('值'),
                contextStore: me.contextStore,
                initBaseConfig: {
                    clazzReadOnly: false,
                    defaultClass: 'ConstantValue',//ConstantValue,ProductAttributeValue,ContextPathValue,CalculationValue，
                    defaultValueType: (me.selectType == 'MULTI' ? 'Array' : me.valueType),
                    valueTypeReadOnly: true,
                    selectType: me.selectType,
                    attrOptions: me.attrOptions,
                },
                diyGetValue: function () {
                    var me = this;
                    return {
                        clazz: "ReturnStructure",
                        value: me.getValue()
                    };
                },
                diySetValue: function (data) {
                    var me = this;
                    me.setValue(data?.value);

                }
            }, me.outputValueFieldConfig),
            Ext.Object.merge({
                xtype: 'condition_field_container',
                itemId: 'condition',
                name: 'condition',
                fieldLabel: i18n.getKey('条件'),
                labelWidth: 50,
                flex: 1,
                contextStore: me.contextStore,
                contextData: me.contextData,
                initBaseConfig: {
                    clazzReadOnly: false,
                    defaultClass: 'ConstantValue',//ConstantValue,ProductAttributeValue,ContextPathValue,CalculationValue，
                    defaultValueType: (me.selectType == 'MULTI' ? 'Array' : me.valueType),
                    valueTypeReadOnly: true,
                    selectType: me.selectType,
                    attrOptions: me.attrOptions
                },
                diyGetValue: function () {
                    return this.getBaseBom();
                },
                diySetValue: function (data) {
                    if (data) {
                        this.setBaseBom(data);
                    }
                }
            }, me.conditionFieldConfig)
        ];
        me.callParent();
    },
    /**
     * 组成IfCondition 结构
     *
     */
    diyGetValue: function () {
        var me = this
        var data = me.getValue();
        return data;
    },
    /**
     * 组成return 结构
     */
    diySetValue: function (data) {
        var me = this;
        me.setValue(data);
    },
});