/**
 * Created by nan on 2018/4/23.
 */
Ext.Loader.syncRequire([]);
Ext.onReady(function () {
    var orderStatusStore = Ext.create('CGP.common.store.OrderStatuses', {
        allowNull: false,
    });
    orderStatusStore.on('load', function () {
        this.insert(0, {
            id: null,
            name: i18n.getKey('allStatus')
        });
    });
    orderStatusStore.load();
    var websiteStore = Ext.create('CGP.partner.store.WebsiteAll');
    var partnerId = JSGetQueryString('partnerId');
    var recordId = JSGetQueryString('recordId');
    var type = JSGetQueryString('type');
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var controller = Ext.create('CGP.partner.view.supplieroderstatuschangeemailnotifyconfig.controller.MainController');
    var createOrEdit = Ext.isEmpty(recordId) ? 'create' : 'edit';
    var editPage = Ext.create(type == 'customer' ? 'CGP.partner.view.supplieroderstatuschangeemailnotifyconfig.view.CustomerCreateOrEditForm' : 'CGP.partner.view.supplieroderstatuschangeemailnotifyconfig.view.ServicerCreateOrEditForm', {
        websiteStore: websiteStore,
        createOrEdit: createOrEdit,
        recordId: recordId,
        type: type,
        partnerId: partnerId,
        orderStatusStore: orderStatusStore,
        itemId: 'emailTemplateConfigForm',
        title: i18n.getKey('emailTemplate') + i18n.getKey('config'),
        listeners: {
            'afterrender': function (view) {
                if (createOrEdit == 'edit') {
                    var MailTemplateStore = Ext.create('CGP.partner.view.supplieroderstatuschangeemailnotifyconfig.store.OrderStatusChangeMailConfigStore', {
                        params: {
                            filter: '[{"name":"_id","value":"' + recordId + '","type":"string"}]'
                        }
                    });
                    MailTemplateStore.load(function () {
                        var record = {};
                        record = MailTemplateStore.getAt(0);
                        if (type == 'customer') {
                            controller.setCustomerFormValue(view, record)
                        } else {
                            controller.setFormValue(view, record);
                        }
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
        var fileName = field.fileName;
        const a = document.createElement('a');
        a.setAttribute('href', imageServer + field.name);
        a.setAttribute('download', fileName);
        a.click();
    };
});