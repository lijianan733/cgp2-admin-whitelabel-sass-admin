/**
 * @Description:上下文的grid
 * @author nan
 * @date 2023/5/25
 */
Ext.define("CGP.common.conditionv2.view.AttributeGridCombo", {
    extend: 'Ext.form.field.GridComboBox',
    alias: 'widget.attribute_grid_combo',
    allowBlank: false,
    haveReset: true,
    valueField: 'key',
    displayField: 'displayName',
    editable: false,
    matchFieldWidth: false,
    store: null,
    diyGetValue: function () {
        var me = this;
        var data = me.getSubmitValue()[0];
        if (data) {
            return {
                attributeId: data,
                clazz: "ProductAttributeValue"
            }
        }
    },
    diySetValue: function (data) {
        var me = this;
        var attributeId = data?.attributeId || '';
        return me.setSubmitValue(attributeId + '');
    },
    initComponent: function () {
        var me = this;

        me.gridCfg = Ext.Object.merge({
            store: me.store,
            height: 350,
            width: 500,
            columns: [
                {
                    dataIndex: 'displayName',
                    flex: 1,
                    text: '上下属性'
                },
                {
                    dataIndex: 'selectType',
                    width: 100,
                    text: '输入方式',
                    renderer: function (value, mateData, record) {
                        var selectType = value;
                        if (selectType == 'NON') {
                            return '手输';
                        } else if (selectType == 'SINGLE') {
                            return '单选';
                        } else if (selectType == 'MULTI') {
                            return '多选';
                        }
                    }
                },
                {
                    dataIndex: 'valueType',
                    width: 100,
                    text: '值类型'
                }
            ]
        }, me.gridCfg);

        //只留下id作为key值的上下文
        if (me.store) {
            var controller = Ext.create('CGP.common.condition.controller.Controller');
            me.store = controller.buildSubStore(me.store, ['skuId', 'materialSpuName']);
            me.gridCfg.store = me.store;
        }
        me.callParent();
    },


})




