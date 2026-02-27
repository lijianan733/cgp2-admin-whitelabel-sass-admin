Ext.Loader.syncRequire([
    'CGP.contactInformations.model.Model',
    'CGP.contactInformations.store.Store',
    'CGP.contactInformations.view.ContactInforMations',
    'CGP.contactInformations.contorller.Contorller',
])
Ext.onReady(function () {
    var controller = Ext.create('CGP.contactInformations.contorller.Contorller');
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: Ext.create('Ext.panel.Panel', {
            layout: 'fit',
            items: Ext.create('CGP.contactInformations.view.ContactInforMations')
        })
    })

});
