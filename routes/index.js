
/*
 * GET home page.
 */

var mongoose = require('mongoose');


mongoose.connect('mongodb://zhfsxtx:zhf19870917@localhost/double11');

var db = mongoose.connection;
db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
    console.log('open double11');
});

var Schema = mongoose.Schema;

var Double11Schema = Schema({
        pinpai: String,
        name: String,
        price1: Number,//现售价
        price2: Number,//专柜价
        price3: Number,//历史最低售价
        price4: Number,//11.11价格
        url: String,//连接
        tag: String//分类
    });


var TagSchema = Schema({
        tag: String,
        brands: [String]
    });



var Model = mongoose.model("product", Double11Schema);
var BrandsModel = mongoose.model("tagBrands", TagSchema);


exports.index = function(req, res){
	res.render('index', {});
};


exports.tag = function(req, res){
	var tag = req.params.tag || "女装";

	BrandsModel.findOne({tag : tag}).exec(function(err, Onebrands){
		if(err) {
	 		console.error(err);
	 		return;
	 	}
	 	if (Onebrands) {
			Model.find({pinpai: Onebrands.brands[0]}).exec(function(err, list){
			 	if(err) {
			 		console.error(err);
			 		return;
			 	}
		 		req.session.tag = tag;
		 		res.render('tag', { title: '陪你买——' + tag, list: list, brands: Onebrands.brands});
			});
	 	};
	})
};


exports.brands = function(req, res){
	if (req.params.brands ) {
		Model.find({pinpai: req.params.brands}).exec(function(err, list){
		 	if(err) {
		 		console.error(err);
		 		return;
		 	}
	 		res.render('products', { list: list});
		 });
	};
};



exports.search = function(req, res){
	
	if (req.query.key ) {
		var where = 'this.name.indexOf("'+ req.query.key + '") >= 0';

		if (req.query._id && req.query.num) {

			Model.find({$where:where}).where('_id').lt(req.query._id).sort({'_id':-1}).limit(100).exec(function(err, list){
			 	if(err) {
			 		console.error(err);
			 		return;
			 	}
			 	res.render('moreproducts', { list: list, num: parseInt(req.query.num)});
			 });

		} else {
			Model.find({$where:where}).sort({'_id':-1}).limit(100).exec(function(err, list){
			 	if(err) {
			 		console.error(err);
			 		return;
			 	}
			 	res.render('search', { list: list});
			 });
		}
	};
};