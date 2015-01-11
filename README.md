# uva

## About

Just a small app that maps your RunKeeper activities onto a calendar view. Written in node.js as an intellectual / itchy-finger experiment.


Related:

* [http://runkeeper-calendar.herokuapp.com](http://runkeeper-calendar.herokuapp.com) (someone with a similar need, publicized via the [Health Graph Google Group](http://groups.google.com/group/HealthGraph)])
* [Health Graph documentation](http://developer.runkeeper.com/healthgraph)

To deploy:

* Run `coffee -c -o cloud src/*` to take the `.coffee` files in `src/` and dump the JS versions into `cloud/` for deployment.`
* Make sure you have a `cloud/keys.js` file that looks like: `exports.keys = { client_id: 'foo', client_secret: 'bar' };`
