Ext.define("CGP.bommaterial.edit.EditTab",{
    extend: 'Ext.tab.Panel',
    region: 'center',
    layout: 'fit',
    initComponent: function(){
        var me = this;
        var information = me.information;
        var customerAttribute = me.customerAttribute;
        var bomPanel = me.bomPanel;
        me.items = [information.content, customerAttribute.content,bomPanel.content];
        me.tbar = [{
            text: i18n.getKey('save'),
            type: 'button',
            handler: function(){
                me.controller.saveBomMaterial(me);
            }
        }/*,{
            text: i18n.getKey('copy'),
            type: 'button',
            handler: function(){
                me.controller.copyBomMaterial(me);
            }
        }*/];
        me.callParent(arguments);
        me.content = me;
    },
    setValue: function (data) {
        var me = this;
        me.information.setValue(data);
}
})