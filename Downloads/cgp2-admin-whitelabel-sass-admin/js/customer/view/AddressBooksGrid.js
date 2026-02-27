/**
 * Created by nan on 2017/11/28.
 */
Ext.require(['CGP.customer.model.AddressBook', 'CGP.customer.model.Customer']);
Ext.onReady(function () {
    var viewport = Ext.create('Ext.container.Viewport', {layout: 'fit'});
    var recordId = JSGetQueryString('recordId');
    var defaultAddressBookId = JSGetQueryString('defaultAddressBookId');
    var useModel = CGP.customer.model.Customer.load(Number(recordId), {
        scope: this,
        failure: function (record, operation) {
        },
        success: function (record, operation) {
            var controller = Ext.create('CGP.customer.controller.AddressBook');
            var grid = Ext.create('CGP.customer.view.addressbook.AddressBooksGrid', {
                recordId: Number(recordId),
                id: 'AddressBooksGrid',
                controller: controller,
                defaultAddressBookId: defaultAddressBookId,
                record: record
            });
            controller.addressBooks = grid;
            viewport.add(grid);
        },
        callback: function (record, operation) {
        }
    })


})