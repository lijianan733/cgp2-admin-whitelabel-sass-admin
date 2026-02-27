/**
 * Created by nan on 2018/8/22.
 */
Ext.define('CGP.customer.view.accesscontroller.SetAccessControllWindow', {
    extend: 'Ext.window.Window',
    modal: true,
    width: 1100,
    height: 700,
    constrain: true,
    selectedRecord: null,//保存选中的记录
    userIdArray: [],
    userId: null,
    selectedRecordIds: new Ext.util.MixedCollection(),
    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    title: i18n.getKey('select') + i18n.getKey('effectRange'),
    initComponent: function () {
        var me = this;
        var leftPanel = Ext.create('CGP.customer.view.accesscontroller.LeftPanel', {
            userId: me.userId,
            rightPanel: rightPanel,
            margin: '10 0 10 10'
        });
        var rightPanel = Ext.create('CGP.customer.view.accesscontroller.RightPanel', {
            userId: me.userId,
            leftPanel: leftPanel,
            margin: '10 10 10 0'

        });
        me.bbar = [
            '->',
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function () {
                    var myMask = new Ext.LoadMask(me, {msg: "Please wait..."});
                    myMask.show();
                    Ext.Ajax.request({
                        url: adminPath + 'api/security/principle/' + me.userId,
                        method: 'PUT',
                        headers: {
                            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                        },
                        jsonData: {
                            acpIds: leftPanel.leftRecordIds,
                            _id: me.userId,
                            principleType: 'User'
                        },
                        success: function (response) {
                            myMask.hide();
                            var responseMessage = Ext.JSON.decode(response.responseText);
                            if (responseMessage.success) {
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('save') + i18n.getKey('success'));

                            } else {
                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                            }
                        },
                        failure: function (response) {
                            myMask.hide();
                            var responseMessage = Ext.JSON.decode(response.responseText);
                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                        }
                    })

                }
            }
        ];

        var center = Ext.create('CGP.customer.view.accesscontroller.CenterPanel');
        me.items = [leftPanel, center, rightPanel];
        me.callParent();

    }
})
