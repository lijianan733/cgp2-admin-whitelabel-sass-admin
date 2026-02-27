Ext.syncRequire(['CGP.partner.view.partnerorderreportconfigmanage.view.EmailTemplateConfigForm']);
Ext.onReady(function () {
    var OrderStatuses = Ext.create('CGP.common.store.OrderStatuses');
    var websiteId = parseInt(this.parent.JSGetQueryString('websiteId'));
    var websiteStore = Ext.data.StoreManager.lookup('websiteStore');
    var recordId = JSGetQueryString('id');
    var website = JSGetQueryString("website");
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var controller = Ext.create('CGP.configuration.serviceomt.controller.Controller');
    var createOrEdit = Ext.isEmpty(recordId) ? 'create' : 'edit';
    var editPage = Ext.create('CGP.configuration.serviceomt.view.CreateOrEditForm', {
        websiteStore: websiteStore,
        website: website,
        createOrEdit:createOrEdit,
        recordId: recordId,
        websiteId: websiteId,
        orderStatusStore: OrderStatuses,
        id: 'emailTemplateConfigForm',
        itemId: 'emailTemplateConfigForm',
        title: i18n.getKey('emailTemplate') + i18n.getKey('config'),
        listeners: {
            'afterrender': function (view) {
                if (createOrEdit == 'edit') {
                    var MailTemplateStore = Ext.create('CGP.configuration.serviceomt.store.ServiceOmtStore', {
                        type:'backstage',
                        params: {
                            filter: '[{"name":"_id","value":"' + recordId + '","type":"string"}]'
                        }
                    });
                    MailTemplateStore.load(function () {
                        var record = {};
                        record = MailTemplateStore.getAt(0);
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
    window.downLoad = function (itemId) {
        var field = Ext.getCmp(itemId);
        var fileName =field.fileName;
        const a = document.createElement('a');
        a.setAttribute('href', imageServer+field.name);
        a.setAttribute('download', fileName);
        a.click();
    };
});