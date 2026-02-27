/**
 * Created by nan on 2020/7/6.
 *再包装一层，模仿field的功能
 */
Ext.Loader.syncRequire([
    'CGP.common.rttypetortobject.view.RtTypeAttributeValueExInputForm'
])
Ext.define("CGP.common.rttypetortobject.view.RtTypeAttributeInputFieldContainer", {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.rttypeattributeinputfieldcontainer',
    defaults: {},
    labelAlign: 'left',
    rtTypeId: null,
    rtTypeAttributeInputFormConfig: null,
    value: null,
    getValue: function () {
        var me = this;
        var rtTypeAttributeInputForm = me.getComponent('rtTypeAttributeInputForm');
        if (me.rtTypeId) {
            return {
                rtType: {
                    clazz: 'com.qpp.cgp.domain.bom.attribute.RtType',
                    _id: me.rtTypeId
                },
                clazz: 'com.qpp.cgp.composing.config.rtobject.RtObjectBuildConfig',
                entrys: rtTypeAttributeInputForm.getValue()
            }
        } else {
            return null;
        }
    },
    setValue: function (data) {
        var me = this;
        if (data && data.rtType) {
            me.rtTypeId = data.rtType._id
        }
        var rtTypeAttributeInputForm = me.getComponent('rtTypeAttributeInputForm');
        if (data && data.entrys) {
            var entrys = data.entrys;
            rtTypeAttributeInputForm.setValue(me.rtTypeId, entrys);
        }
    },
    constructor: function () {
        var me = this;
        me.callParent(arguments);

    },
    initComponent: function () {
        var me = this;
        me.hidden = Ext.isEmpty(me.hidden) ? (me.rtTypeId ? false : true) : me.hidden;
        me.disabled = Ext.isEmpty(me.disabled) ? (me.rtTypeId ? false : true) : me.disabled;
        me.items = [
            Ext.Object.merge({
                xtype: 'rttypeattributevalueexinputform',
                width: '100%',
                hideRtType: true,
                minHeight: 100,
                padding: 0,
                margin: 0,
                itemId: 'rtTypeAttributeInputForm',
                maxHeight: 300,
                autoScroll: true,
                name: 'entrys',
                fieldLabel: '上下文',
                rtTypeId: me.rtTypeId,
                viewConfig: {
                    stripeRows: true,
                }
            }, me.rtTypeAttributeInputFormConfig)
        ];
        me.callParent();
    },
})
