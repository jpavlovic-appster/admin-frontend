


<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400"></a></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains over 1500 video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the Laravel [Patreon page](https://patreon.com/taylorotwell).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Cubet Techno Labs](https://cubettech.com)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[Many](https://www.many.co.uk)**
- **[Webdock, Fast VPS Hosting](https://www.webdock.io/en)**
- **[DevSquad](https://devsquad.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[OP.GG](https://op.gg)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).


composer require laravel/passport
php artisan session:table
php artisan passport:install
php artisan migrate
php artisan vendor:publish --tag="cors"
php artisan key:generate

sudo chown www-data:www-data storage/oauth-*.key
sudo chmod 600 storage/oauth-*.key

sudo mkdir -p storage/framework/{sessions,views,cache}
sudo mkdir -p storage/framework/cache/data
sudo mkdir docker_volumes_data
sudo chmod -R 775 storage/
sudo chown -R www-data:www-data storage/
add .evn file
sudo php composer.phar update

composer dump-autoload &&
php artisan config:clear &&
php artisan route:clear &&
php artisan config:cache &&
php artisan cache:clear

php artisan tinker

#then type (replace with your data)
DB::table('users')->insert(['name'=>'MyUsername','email'=>'thisis@myemail.com','password'=>Hash::make('123456')])
DB::table('admin_users')->insert(['first_name'=>'dev','email'=>'test@test.com','encrypted_password'=>Hash::make('123456')])
DB::table('super_admin_users')->insert(['first_name'=>'dev','email'=>'super@test.com','encrypted_password'=>Hash::make('123456'),
'created_at'=>'2021-05-10 00:00:00','updated_at'=>'2021-05-01 00:00:00'])
 # exit
 
 
##### and logout api /api/logout  with 
                                        Accept:application/json
                                       Authorization:Bearer <access token>
 sudo a2enmod rewrite


 sudo a2enmod headers
   Header set Access-Control-Allow-Origin "*"
   Header set Access-Control-Allow-Methods: "*"
   Header set Access-Control-Allow-Headers: "Origin, X-Requested-With, Content-Type, Accept, Authorization"



https://medium.com/@nasrulhazim/laravel-using-different-table-and-guard-for-login-bc426d067901
https://www.codecheef.org/article/laravel-8-login-with-custom-guard-example


#php artisan make:controller CurrenciesController --resource --model=Currencies

#php artisan make:controller AdminController --api
#php artisan make:model Wallets
#php artisan make:controller Api/TransactionsController --resource --model=Transactions
#php artisan make:controller AdminController --api
#php artisan make:model Wallets
#php artisan make:controller Api/TransactionsController --resource --model=Transactions
for custom auth
#https://medium.com/@gmaumoh/adding-laravel-passport-authentication-to-your-laravel-api-part-1-setting-up-scopes-for-your-7195cf059477

#for get SQL Query befour run migration
php artisan migrate --pretend

# steps of code update in development server
 # Our code in stage Brnach also ssh login
 
cd /var/www/html/admin-csb
sudo git pull --all 
sudo ng build --prod
cd dist/ 
sudo cp /var/www/html/admin-csb/.htaccess ./
sudo ln -s /var/www/html/admin-csb/backend/ ./



# After Install Docker
   #sudo chown -R 1000:1000 [directory]

sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

docker-compose --version

sudo chown -R 1000:1000 docker_volumes_data/
sudo chown -R 1000:1000 /var/lib/elasticsearch/esdata1

sudo docker-compose up/down

# After Installing Supervisor

add conf file to this path:
nano /etc/supervisor/conf.d/laravel-worker.conf

with content of file backend/laravel-worker-sample.conf

update the paths in this file as per requirement

run the below commands for final setup:
supervisorctl reread
supervisorctl update
# supervisorctl start all
supervisorctl restart all