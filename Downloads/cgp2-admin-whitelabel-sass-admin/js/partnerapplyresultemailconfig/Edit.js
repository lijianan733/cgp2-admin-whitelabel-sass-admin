/**
 * Created by nan on 2018/1/31.
 */
Ext.syncRequire(['CGP.partner.view.partnerorderreportconfigmanage.view.DiyEmailsFieldComponent', 'CGP.mailhistory.controller.overridesubmit', 'CGP.partnerapplyresultemailconfig.store.PartnerApplyResultEmailConfigStore']);
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var websiteStore = Ext.create('CGP.partner.store.WebsiteAll');
    var roleStore = Ext.create("CGP.role.store.Role", {
        listeners: {
            load: function (DBStorestore, records) {
                for (var i = 0; i < records.length; i++) {
                    records[i].set('show', records[i].get('name') + "(角色编号：" + records[i].get('id') + ")");
                }
            }
        }
    });
    var recordId = JSGetQueryString('recordId');
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var controller = Ext.create('CGP.partnerapplyresultemailconfig.controller.Controller');
    var createOrEdit = Ext.isEmpty(recordId) ? 'create' : 'edit';
    var editPage = Ext.create('CGP.partnerapplyresultemailconfig.view.EmailTemplateConfigForm', {
        websiteStore: websiteStore,
        createOrEdit: createOrEdit,
        roleStore: roleStore,
        recordId: recordId,
        id: 'emailTemplateConfigForm',
        itemId: 'emailTemplateConfigForm',
        title: i18n.getKey('emailTemplate') + i18n.getKey('config'),
        listeners: {
            'afterrender': function (view) {
                if (createOrEdit == 'edit') {
                    var PartnerApplyResultEmailConfigStore = Ext.create('CGP.partnerapplyresultemailconfig.store.PartnerApplyResultEmailConfigStore', {
                        params: {
                            filter: '[{"name":"_id","value":"' + recordId + '","type":"string"}]'
                        }
                    });
                    PartnerApplyResultEmailConfigStore.load(function () {
                        var record = {};
                        record = PartnerApplyResultEmailConfigStore.getAt(0);
                        controller.setFormValue(view, record);
                    });
                }
            }
        }
    });
    page.add(editPage);
    window.deleteEmail = function (itemId) {
        var field = Ext.getCmp(itemId);
        field.ownerCt.remove(field);
    };
    window.deleteFile = function (itemId) {
        var field = Ext.getCmp(itemId);
        field.ownerCt.remove(field);
    };
    window.downLoad = function (itemId) {
        var field = Ext.getCmp(itemId);
        var fileName = field.fileName;
        const a = document.createElement('a');
        a.setAttribute('href', encodeURI(imageServer + field.name));
        a.setAttribute('download', '666');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    };
})