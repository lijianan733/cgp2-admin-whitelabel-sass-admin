/**
 * Created by nan on 2020/8/31.
 *再包装一层，模仿field的功能
 */
Ext.Loader.syncRequire([
    'CGP.common.rttypetortobject.view.RtTypeToRtObjectForm',
    'CGP.common.rttypetortobject.view.RtTypeToRtObjectFormV2'
])
Ext.define("CGP.common.rttypetortobject.view.RtTypeToRtObjectFieldContainer", {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.rttypetortobjectfieldcontainer',
    defaults: {},
    labelAlign: 'left',
    rtTypeId: null,
    rtType: null,
    rtTypeAttributeInputFormConfig: null,
    value: null,
    getValue: function () {
        var me = this;
        var rtTypeToRtObjectForm = me.getComponent('rtTypeToRtObjectForm');
        var rtTypeId = rtTypeToRtObjectForm.rtType._id;
        return {
            rtType: {
                clazz: 'com.qpp.cgp.domain.bom.attribute.RtType',
                _id: rtTypeId
            },
            clazz: 'com.qpp.cgp.domain.bom.runtime.RtObject',
            objectJSON: rtTypeToRtObjectForm.getValue()
        }
    },
    isDirty: function () {
        return false;
    },
    setValue: function (data) {
        var me = this;
        if (data && data.rtType) {
            me.rtTypeId = data.rtType._id;
            me.rtType = data.rtType;
            var rtTypeToRtObjectForm = me.getComponent('rtTypeToRtObjectForm');
            rtTypeToRtObjectForm.setValue(me.rtType, data.objectJSON || {});
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
                    xtype: 'rttypetortobjectform',
                    width: '100%',
                    hideRtType: true,
                    minHeight: 100,
                    padding: 0,
                    margin: 0,
                    itemId: 'rtTypeToRtObjectForm',
                    maxHeight: 300,
                    autoScroll: true,
                    name: 'rtObject',
                    fieldLabel: '上下文',
                    rtTypeId: me.rtTypeId,
                    rtType: me.rtType,
                    viewConfig: {
                        stripeRows: true,
                    }
                },
                me.rtTypeAttributeInputFormConfig
            )
        ];
        me.callParent();
    },
})
