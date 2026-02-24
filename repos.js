/**
 * Repository Configuration Database
 * 
 * Structure for each entry:
 * - name: Display name in dropdown
 * - url: Git clone URL (used as unique ID)
 * - framework: 'django', 'flask', 'fastapi', 'frappe', or 'generic'
 * - setupCommands: Object with optional overrides:
 *      - preInstall: Commands to run before venv creation/requirements
 *      - postInstall: Commands to run after pip install
 *      - adminCreate: Custom admin creation command
 */
const REPO_LIST = [
    {
        category: "Horilla Apps",
        repos: [
            {
                name: "Horilla HRM",
                url: "https://github.com/horilla-opensource/horilla.git",
                description: "Open source Human Resource Management System",
                framework: "django",
                complexity: "Advanced",
                stars: "1.2k+",
                setupCommands: {
                    preInstall: "cp .env.dist .env 2>/dev/null || cp .env.example .env 2>/dev/null || true",
                    postInstall: "python3 manage.py makemigrations && python3 manage.py migrate && echo \"\" && echo \"IMPORTANT: To initialize the database or load demo data, use the web UI.\"",
                    adminCreate: "python3 manage.py createhorillauser --first_name Admin --last_name Admin --username __USER__ --password __PASS__ --email __EMAIL__ --phone 1234567890",
                    loadDemoCmd: "python3 manage.py loaddata initial_data"
                },
                dependencies: {
                    mode: 'pip',
                    files: ['requirements.txt']
                },
                defaults: {
                    adminUser: "admin",
                    adminPass: "admin"
                },
                features: {
                    hasDb: true,
                    hasDemo: true
                },
                dbInitPassword: "d3f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d",
                dbInitPasswordLocation: "Hardcoded in horilla/horilla_views/cbv_methods.py",
                knownIssues: "⚠️ Requires libpq-dev: Run 'sudo apt-get install libpq-dev' before setup, or edit requirements.txt to use psycopg[binary] instead of psycopg[c]"
            },
            {
                name: "Horilla CRM",
                url: "https://github.com/horilla-opensource/horilla-crm.git",
                description: "Open source Customer Relationship Management",
                framework: "django",
                complexity: "Advanced",
                stars: "500+",
                setupCommands: {
                    preInstall: "cp .env.dist .env 2>/dev/null || cp .env.example .env 2>/dev/null || true",
                    postInstall: "python3 manage.py makemigrations && python3 manage.py migrate && echo \"\" && echo \"IMPORTANT: To initialize the database or load demo data, use the web UI.\"",
                    adminCreate: "export DJANGO_SUPERUSER_PASSWORD=__PASS__ && python3 manage.py createsuperuser --noinput --username __USER__ --email __EMAIL__",
                    loadDemoCmd: "python3 manage.py loaddata initial_data"
                },
                defaults: {
                    adminUser: "admin",
                    adminPass: "admin"
                },
                features: {
                    hasDb: true,
                    hasDemo: true
                },
                dbInitPassword: "Check init_pass.txt in project root after first run",
                dbInitPasswordLocation: "Generated in init_pass.txt (created on first run)"
            }
        ]
    },
    {

        category: "Django Frameworks",
        repos: [
            {
                name: "Saleor",
                url: "https://github.com/saleor/saleor.git",
                description: "Headless E-commerce platform - GraphQL API",
                framework: "django",
                complexity: "Advanced",
                stars: "20k+",
                setupCommands: {
                    postInstall: "cp .env.example .env 2>/dev/null || true && echo \"SECRET_KEY=dev-secret\nRSA_PRIVATE_KEY=internal\" >> .env && python3 manage.py migrate",
                    adminCreate: "python3 manage.py createsuperuser --noinput --username admin --email admin@example.com"
                },
                dependencies: {
                    mode: 'poetry',
                    command: 'pip install poetry && poetry install --no-dev || poetry install'
                },
                features: {
                    hasDb: true,
                    hasDemo: false
                },
                knownIssues: "⚠️ Dependency conflict: vcrpy requires urllib3<2, but Saleor needs urllib3>=2.4. Use 'poetry install --no-dev' to skip test dependencies."
            },
            {
                name: "Wagtail CMS",
                url: "https://github.com/wagtail/wagtail.git",
                description: "Open source CMS built on Django",
                framework: "django",
                complexity: "Advanced",
                stars: "18k+",
                setupCommands: {
                    postInstall: "pip install -e . && wagtail start myproject && cd myproject && pip install -r requirements.txt && python3 manage.py migrate"
                },
                dependencies: {
                    mode: 'manual',
                    command: 'echo "Wagtail requires project creation first. See post-install commands."'
                },
                features: {
                    hasDb: true,
                    hasDemo: false
                }
            },
            {
                name: "Open edX (Tutor/Devstack)",
                url: "https://github.com/openedx/edx-platform.git",
                description: "LMS and Enterprise Learning Platform",
                framework: "django",
                complexity: "Expert",
                stars: "7k+",
                setupCommands: {
                    preInstall: "echo 'Recommended: Use Tutor (https://docs.tutor.edly.io/) for easiest setup.' && (command -v docker >/dev/null || echo '⚠️ Docker is required for Tutor/Devstack') && sudo apt-get install -y build-essential python3-dev libmysqlclient-dev libssl-dev libffi-dev || echo 'System deps install skipped'",
                    postInstall: "echo 'To use Tutor (Recommended): pip install tutor && tutor local launch'\necho 'To use legacy Devstack: pip install -r requirements/pip.txt && pip install -r requirements/edx/base.txt'",
                    runServer: "echo 'Run: tutor local start -d' # Or python3 manage.py runserver for legacy",
                    loadDemoCmd: "tutor local do init --limit=demo"
                },
                dependencies: {
                    mode: 'pip',
                    files: ['requirements/pip.txt', 'requirements/edx/base.txt']
                },
                knownIssues: "⚠️ High Resource Usage: Minimum 8GB RAM recommended. Docker required for Tutor."
            },

            {
                name: "Zulip",
                url: "https://github.com/zulip/zulip.git",
                description: "Team chat application with threading",
                framework: "django",
                complexity: "Expert",
                stars: "21k+",
                setupCommands: {
                    preInstall: "./tools/setup/install || (pip install -r requirements/dev.txt && python manage.py initialize_database)",
                    runServer: "./tools/run-dev.py"
                },
                dependencies: {
                    mode: 'pip',
                    files: ['requirements/dev.txt']
                },
                features: {
                    hasDb: true,
                    hasDemo: false
                }
            },
            {
                name: "Mayan EDMS",
                url: "https://gitlab.com/mayan-edms/mayan-edms.git",
                description: "Document management system",
                framework: "django",
                complexity: "Advanced",
                stars: "2k+",
                setupCommands: {
                    postInstall: "pip install -r requirements.txt && python manage.py shell -c \"from mayan.apps.documents.models import DocumentType; DocumentType.objects.get_or_create(label='Default')\""
                },
                dependencies: {
                    mode: 'pip',
                    files: ['requirements.txt']
                },
                features: {
                    hasDb: true,
                    hasAdmin: true,
                    hasDemo: false
                }
            },
            {
                name: "PostHog",
                url: "https://github.com/PostHog/posthog.git",
                description: "Product analytics platform",
                framework: "django",
                complexity: "Expert",
                stars: "20k+",
                setupCommands: {
                    postInstall: "cp .env.example .env 2>/dev/null || true && echo \"DATABASE_URL=postgres://postgres:postgres@localhost:5432/posthog\" >> .env && pip install -r requirements.txt",
                    adminCreate: "python3 manage.py createsuperuser --noinput --username admin --email admin@example.com"
                },
                dependencies: {
                    mode: 'pip',
                    files: ['requirements.txt']
                },
                features: {
                    hasDb: true,
                    hasDemo: false
                }
            },
            {
                name: "DefectDojo",
                url: "https://github.com/DefectDojo/django-DefectDojo.git",
                description: "DevSecOps vulnerability management",
                framework: "django",
                complexity: "Advanced",
                stars: "3.6k+",
                setupCommands: {
                    postInstall: "cp ./dojo/settings/template-settings.dist.py ./dojo/settings/local_settings.py || true && pip install -r requirements.txt",
                    adminCreate: "python3 manage.py createsuperuser --noinput --username admin --email admin@example.com"
                },
                dependencies: {
                    mode: 'pip',
                    files: ['requirements.txt']
                },
                features: {
                    hasDb: true,
                    hasDemo: false
                }
            },
            {
                name: "NetBox",
                url: "https://github.com/netbox-community/netbox.git",
                description: "Network source of truth / IPAM",
                framework: "django",
                complexity: "Advanced",
                stars: "16k+",
                setupCommands: {
                    postInstall: "mkdir -p netbox/netbox/configuration && echo \"ALLOWED_HOSTS = ['*']\nDATABASE = {'ENGINE': 'django.db.backends.sqlite3', 'NAME': 'netbox'}\nSECRET_KEY = 'temp-key'\" > netbox/netbox/configuration/configuration.py"
                },
                dependencies: {
                    mode: 'pip',
                    files: ['requirements.txt']
                },
                features: {
                    hasDb: true,
                    hasDemo: false
                }
            },
            {
                name: "Taiga",
                url: "https://github.com/taigaio/taiga-back.git",
                description: "Agile project management platform",
                framework: "django",
                complexity: "Advanced",
                stars: "7k+",
                setupCommands: {
                    postInstall: "cp settings/local.py.example settings/local.py"
                },
                dependencies: {
                    mode: 'pip',
                    files: ['requirements.txt']
                }
            },
            {
                name: "Flagsmith",
                url: "https://github.com/Flagsmith/flagsmith.git",
                description: "Feature flag management",
                framework: "django",
                complexity: "Intermediate",
                stars: "4k+",
                setupCommands: {
                    postInstall: "echo \"DJANGO_ALLOWED_HOSTS=*\" > .env && pip install -r requirements.txt",
                    adminCreate: "python3 manage.py createsuperuser --noinput --username admin --email admin@example.com"
                },
                dependencies: {
                    mode: 'pip',
                    files: ['requirements.txt']
                }
            },
            {
                name: "Sentry",
                url: "https://github.com/getsentry/sentry.git",
                description: "Error tracking and performance monitoring",
                framework: "django",
                complexity: "Expert",
                stars: "38k+",
                setupCommands: {
                    preInstall: "echo 'Sentry requires significant system resources (Docker recommended)'",
                    postInstall: "pip install -e .",
                    runServer: "sentry devserver"
                },
                dependencies: {
                    mode: 'pip',
                    command: 'pip install -e .'
                }
            },
            {
                name: "Mezzanine",
                url: "https://github.com/stephenmcd/mezzanine.git",
                description: "Powerful content management platform",
                framework: "django",
                complexity: "Intermediate",
                stars: "4.7k+",
                setupCommands: {
                    postInstall: "mezzanine-project myproject && cd myproject"
                },
                dependencies: {
                    mode: 'pip',
                    command: 'pip install mezzanine'
                }
            },
            {
                name: "Django REST Framework",
                url: "https://github.com/encode/django-rest-framework.git",
                description: "Powerful and flexible toolkit for building Web APIs",
                framework: "django",
                complexity: "Intermediate",
                stars: "28k+",
                features: {
                    hasDb: false,
                    hasDemo: false
                }
            },
            {
                name: "Django itself",
                url: "https://github.com/django/django.git",
                description: "The Django web framework source code",
                framework: "django",
                complexity: "Advanced",
                stars: "79k+",
                features: {
                    hasDb: false,
                    hasAdmin: false,
                    hasDemo: false
                }
            },
            {
                name: "BookWyrm",
                url: "https://github.com/bookwyrm-social/bookwyrm.git",
                description: "Social reading and reviewing, decentralized with ActivityPub",
                framework: "django",
                complexity: "Advanced",
                stars: "3.5k+",
                setupCommands: {
                    preInstall: "cp .env.example .env 2>/dev/null || true && echo \"\nSECRET_KEY=dev-secret\nDOMAIN=localhost:8000\" >> .env",
                    postInstall: "python3 manage.py makemigrations || true\n    python3 manage.py migrate || true\n    python3 manage.py init_db || true",
                    adminCreate: "python3 manage.py createsuperuser --noinput --username __USER__ --email __EMAIL__"
                },
                dependencies: {
                    mode: 'pip',
                    command: "python3 -m pip install -U 'pip>=25.1.0' && pip install --group main"
                },
                features: {
                    hasDb: true,
                    hasAdmin: true,
                    hasDemo: true
                }
            },
            {
                name: "Django-allauth",
                url: "https://github.com/pennersr/django-allauth.git",
                description: "Integrated Django authentication",
                framework: "django",
                complexity: "Intermediate",
                stars: "9k+",
                setupCommands: {
                    postInstall: "pip install -e . && echo 'Add \"allauth\" to INSTALLED_APPS and run manage.py migrate'",
                },
                dependencies: {
                    mode: 'pip',
                    command: 'pip install -e .'
                }
            }
        ]
    },
    {
        category: "FastAPI Frameworks",
        repos: [
            {
                name: "Full Stack FastAPI Template",
                url: "https://github.com/fastapi/full-stack-fastapi-template.git",
                description: "Official full-stack template by Sebastián Ramírez",
                framework: "fastapi",
                complexity: "Intermediate",
                stars: "26k+",
                setupCommands: {
                    postInstall: "pip install -r ./backend/requirements.txt && echo \"SECRET_KEY=temp\nSQLALCHEMY_DATABASE_URL=sqlite:///./test.db\" > .env && cd backend && alembic upgrade head",
                    runServer: "fastapi dev backend/app/main.py"
                },
                dependencies: {
                    mode: 'pip',
                    files: ['backend/requirements.txt']
                }
            },
            {
                name: "FastAPI itself",
                url: "https://github.com/tiangolo/fastapi.git",
                description: "Modern, fast web framework for building APIs",
                framework: "fastapi",
                complexity: "Intermediate",
                stars: "76k+",
                setupCommands: {
                    postInstall: "pip install -e . && pip install -r requirements-dev.txt"
                },
                dependencies: {
                    mode: 'pip',
                    files: ['requirements-dev.txt'],
                    command: 'pip install -e . && pip install -r requirements-dev.txt'
                }
            },
            {
                name: "Polar",
                url: "https://github.com/polarsource/polar.git",
                description: "Open source monetization platform",
                framework: "fastapi",
                complexity: "Advanced",
                stars: "3k+",
                setupCommands: {
                    postInstall: "pip install -r requirements.txt && echo \"DATABASE_URL=sqlite:///./test.db\" > .env && alembic upgrade head"
                },
                dependencies: {
                    mode: 'pip',
                    files: ['requirements.txt']
                }
            },
            {
                name: "SQLModel",
                url: "https://github.com/tiangolo/sqlmodel.git",
                description: "SQL databases with Python type annotations",
                framework: "fastapi",
                complexity: "Intermediate",
                stars: "14k+",
                setupCommands: {
                    postInstall: "pip install -e . && pip install -r requirements-dev.txt"
                }
            },
            {
                name: "Litestar",
                url: "https://github.com/litestar-org/litestar.git",
                description: "Production-ready, light ASGI framework",
                framework: "fastapi",
                complexity: "Intermediate",
                stars: "5k+",
                setupCommands: {
                    postInstall: "pip install -e . && pip install -r requirements-dev.txt"
                }
            },
            {
                name: "Strawberry GraphQL",
                url: "https://github.com/strawberry-graphql/strawberry.git",
                description: "Python GraphQL library based on dataclasses",
                framework: "fastapi",
                complexity: "Intermediate",
                stars: "4k+",
                setupCommands: {
                    postInstall: "pip install -e . && pip install -r requirements-dev.txt"
                }
            },
            {
                name: "Authlib",
                url: "https://github.com/authlib/authlib.git",
                description: "Ultimate Python library for OAuth and OpenID",
                framework: "generic",
                complexity: "Advanced",
                stars: "4.5k+",
                setupCommands: {
                    postInstall: "pip install -e . && pip install -r requirements-dev.txt"
                }
            },
            {
                name: "FastHTML",
                url: "https://github.com/AnswerDotAI/fasthtml.git",
                description: "Modern HTML-first framework",
                framework: "fastapi",
                complexity: "Beginner",
                stars: "5k+",
                setupCommands: {
                    postInstall: "pip install -e ."
                }
            },
            {
                name: "Robyn",
                url: "https://github.com/sansyryli/robyn.git",
                description: "Fast async Python web framework with Rust runtime",
                framework: "fastapi",
                complexity: "Intermediate",
                stars: "4k+",
                setupCommands: {
                    postInstall: "pip install robyn"
                }
            },
            {
                name: "Typer",
                url: "https://github.com/tiangolo/typer.git",
                description: "Build great CLIs fast",
                framework: "generic",
                complexity: "Beginner",
                stars: "15k+",
                setupCommands: {
                    postInstall: "pip install -e . && pip install -r requirements-dev.txt"
                }
            },
            {
                name: "FastAPI-Users",
                url: "https://github.com/frankie567/fastapi-users.git",
                description: "Ready-to-use authentication and user management",
                framework: "fastapi",
                complexity: "Intermediate",
                stars: "4k+",
                setupCommands: {
                    postInstall: "pip install -e . && pip install -r requirements-dev.txt"
                }
            },
            {
                name: "HTTPX",
                url: "https://github.com/encode/httpx.git",
                description: "A next generation HTTP client for Python",
                framework: "generic",
                complexity: "Intermediate",
                stars: "13k+"
            },
            {
                name: "Pydantic",
                url: "https://github.com/pydantic/pydantic.git",
                description: "Data validation using Python type annotations",
                framework: "generic",
                complexity: "Intermediate",
                stars: "20k+"
            },
            {
                name: "Uvicorn",
                url: "https://github.com/encode/uvicorn.git",
                description: "Lightning-fast ASGI server",
                framework: "fastapi",
                complexity: "Intermediate",
                stars: "8k+",
                setupCommands: {
                    runServer: "uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
                }
            },
            {
                name: "Starlette",
                url: "https://github.com/encode/starlette.git",
                description: "Lightweight ASGI framework/toolkit",
                framework: "fastapi",
                complexity: "Intermediate",
                stars: "10k+"
            }
        ]
    },
    {
        category: "Flask Frameworks",
        repos: [
            {
                name: "Flask itself",
                url: "https://github.com/pallets/flask.git",
                description: "The Flask web framework source code",
                framework: "flask",
                complexity: "Intermediate",
                stars: "67k+",
                setupCommands: {
                    postInstall: "pip install -e . && pip install -r requirements/dev.txt"
                }
            },
            {
                name: "Flask-SQLAlchemy",
                url: "https://github.com/pallets-eco/flask-sqlalchemy.git",
                description: "Adds SQLAlchemy support to Flask",
                framework: "flask",
                complexity: "Intermediate",
                stars: "4k+",
                setupCommands: {
                    postInstall: "pip install -e ."
                }
            },
            {
                name: "Flask-RESTful",
                url: "https://github.com/flask-restful/flask-restful.git",
                description: "Simple framework for creating REST APIs",
                framework: "flask",
                complexity: "Intermediate",
                stars: "6.8k+",
                setupCommands: {
                    postInstall: "pip install -e ."
                }
            },
            {
                name: "Flask-Login",
                url: "https://github.com/maxcountryman/flask-login.git",
                description: "User session management for Flask",
                framework: "flask",
                complexity: "Beginner",
                stars: "3.5k+",
                setupCommands: {
                    postInstall: "pip install -e ."
                }
            },
            {
                name: "Flask-JWT-Extended",
                url: "https://github.com/vimalloc/flask-jwt-extended.git",
                description: "Extended JWT integration with Flask",
                framework: "flask",
                complexity: "Intermediate",
                stars: "1.5k+",
                setupCommands: {
                    postInstall: "pip install -e ."
                }
            },
            {
                name: "Flask-Admin",
                url: "https://github.com/flask-admin/flask-admin.git",
                description: "Simple and extensible admin interface framework",
                framework: "flask",
                complexity: "Intermediate",
                stars: "5.7k+",
                setupCommands: {
                    postInstall: "pip install -e ."
                }
            },
            {
                name: "Flask-CORS",
                url: "https://github.com/corydolphin/flask-cors.git",
                description: "Cross Origin Resource Sharing extension",
                framework: "flask",
                complexity: "Beginner",
                stars: "880+",
                setupCommands: {
                    postInstall: "pip install -e ."
                }
            },
            {
                name: "Flask-Migrate",
                url: "https://github.com/miguelgrinberg/flask-migrate.git",
                description: "SQLAlchemy database migrations",
                framework: "flask",
                complexity: "Intermediate",
                stars: "2.4k+",
                setupCommands: {
                    postInstall: "pip install -e ."
                }
            },
            {
                name: "Eve",
                url: "https://github.com/pyeve/eve.git",
                description: "REST API framework powered by Flask",
                framework: "flask",
                complexity: "Intermediate",
                stars: "6.7k+",
                setupCommands: {
                    postInstall: "pip install -e ."
                }
            },
            {
                name: "Connexion",
                url: "https://github.com/spec-first/connexion.git",
                description: "Swagger/OpenAPI First framework on top of Flask",
                framework: "flask",
                complexity: "Intermediate",
                stars: "4.5k+",
                setupCommands: {
                    postInstall: "pip install -e ."
                }
            }
        ]
    },
    {
        category: "Data & ORM Libraries",
        repos: [
            {
                name: "SQLAlchemy",
                url: "https://github.com/sqlalchemy/sqlalchemy.git",
                description: "Python SQL toolkit and ORM",
                framework: "generic",
                complexity: "Advanced",
                stars: "9k+",
                setupCommands: {
                    postInstall: "pip install -e ."
                }
            },
            {
                name: "Alembic",
                url: "https://github.com/sqlalchemy/alembic.git",
                description: "Database migration tool for SQLAlchemy",
                framework: "generic",
                complexity: "Intermediate",
                stars: "2.5k+",
                setupCommands: {
                    postInstall: "pip install -e ."
                }
            },
            {
                name: "Asyncpg",
                url: "https://github.com/MagicStack/asyncpg.git",
                description: "Fast PostgreSQL database client library",
                framework: "generic",
                complexity: "Intermediate",
                stars: "6.8k+",
                setupCommands: {
                    postInstall: "pip install -e ."
                }
            },
            {
                name: "Motor",
                url: "https://github.com/mongodb-labs/motor.git",
                description: "Async Python driver for MongoDB",
                framework: "generic",
                complexity: "Intermediate",
                stars: "2.4k+",
                setupCommands: {
                    postInstall: "pip install -e ."
                }
            },
            {
                name: "Redis-py",
                url: "https://github.com/redis/redis-py.git",
                description: "Python client for Redis",
                framework: "generic",
                complexity: "Beginner",
                stars: "12k+",
                setupCommands: {
                    postInstall: "pip install -e ."
                }
            },
            {
                name: "Tortoise ORM",
                url: "https://github.com/tortoise/tortoise-orm.git",
                description: "Easy async ORM for Python",
                framework: "generic",
                complexity: "Intermediate",
                stars: "4.5k+",
                setupCommands: {
                    postInstall: "pip install -e . && pip install -r requirements-dev.txt"
                }
            },
            {
                name: "Piccolo ORM",
                url: "https://github.com/piccolo-orm/piccolo.git",
                description: "Fast, user friendly ORM and query builder",
                framework: "generic",
                complexity: "Intermediate",
                stars: "1.4k+",
                setupCommands: {
                    postInstall: "pip install -e . && pip install -r requirements/dev.txt"
                }
            },
            {
                name: "Celery",
                url: "https://github.com/celery/celery.git",
                description: "Distributed task queue",
                framework: "generic",
                complexity: "Advanced",
                stars: "24k+",
                setupCommands: {
                    postInstall: "pip install -e . && pip install -r requirements/dev.txt"
                }
            },
            {
                name: "Dependency Injector",
                url: "https://github.com/ets-labs/python-dependency-injector.git",
                description: "Dependency injection framework",
                framework: "generic",
                complexity: "Intermediate",
                stars: "3.8k+",
                setupCommands: {
                    postInstall: "pip install -e ."
                }
            }
        ]
    },
    {
        category: "Frappe & Specialized",
        repos: [
            {
                name: "ERPNext",
                url: "https://github.com/frappe/erpnext.git",
                description: "Complete ERP system built on Frappe",
                framework: "frappe",
                complexity: "Expert",
                stars: "20k+",
                setupCommands: {
                    preInstall: "bench init frappe-app && cd frappe-app",
                    postInstall: "bench get-app erpnext && bench new-site mysite.local && bench --site mysite.local install-app erpnext",
                    runServer: "bench start"
                },
                dependencies: {
                    mode: 'manual',
                    command: 'echo "Frappe/ERPNext uses bench for dependencies."'
                }
            },
            {
                name: "Frappe Framework",
                url: "https://github.com/frappe/frappe.git",
                description: "Full-stack web framework",
                framework: "frappe",
                complexity: "Advanced",
                stars: "7k+",
                setupCommands: {
                    preInstall: "bench init frappe-app",
                    runServer: "bench start"
                },
                dependencies: {
                    mode: 'manual',
                    command: 'echo "Frappe uses bench for dependencies."'
                }
            },
            {
                name: "Frappe Docker",
                url: "https://github.com/frappe/frappe_docker.git",
                description: "Docker Setup for Frappe/ERPNext",
                framework: "generic",
                complexity: "Intermediate",
                stars: "2k+",
                setupCommands: {
                    postInstall: "cp .env.sample .env",
                    runServer: "docker-compose up -d"
                }
            },
            {
                name: "Frappe Press",
                url: "https://github.com/frappe/press.git",
                description: "Press: Manage Frappe Sites in Production",
                framework: "frappe",
                complexity: "Expert",
                stars: "500+",
                setupCommands: {
                    postInstall: "bench get-app https://github.com/frappe/press"
                }
            },
            {
                name: "Frappe Payments",
                url: "https://github.com/frappe/payments.git",
                description: "Payment Gateway integrations for Frappe",
                framework: "frappe",
                complexity: "Intermediate",
                stars: "200+",
                setupCommands: {
                    postInstall: "bench --site mysite.local install-app payments"
                }
            },
            {
                name: "Frappe Helm",
                url: "https://github.com/frappe/helm.git",
                description: "Helm Chart for Frappe/ERPNext",
                framework: "generic",
                complexity: "Intermediate",
                stars: "400+",
                setupCommands: {
                    postInstall: "helm repo add frappe https://helm.frappe.io"
                }
            },
            {
                name: "Odoo",
                url: "https://github.com/odoo/odoo.git",
                description: "Business management suite",
                framework: "generic",
                complexity: "Expert",
                stars: "37k+",
                setupCommands: {
                    runServer: "python odoo-bin -d demo --addons-path=addons --xmlrpc-port=8069"
                },
                dependencies: {
                    mode: 'pip',
                    files: ['requirements.txt']
                }
            },
            {
                name: "Graphene",
                url: "https://github.com/graphql-python/graphene.git",
                description: "GraphQL framework for Python",
                framework: "generic",
                complexity: "Intermediate",
                stars: "8k+",
                setupCommands: {
                    postInstall: "pip install -e . && pip install -r requirements-dev.txt"
                }
            },
            {
                name: "Prefect",
                url: "https://github.com/PrefectHQ/prefect.git",
                description: "Modern workflow orchestration",
                framework: "generic",
                complexity: "Advanced",
                stars: "16k+",
                setupCommands: {
                    postInstall: "pip install -e . && pip install -r requirements-dev.txt"
                }
            },
            {
                name: "Airflow",
                url: "https://github.com/apache/airflow.git",
                description: "Platform to programmatically author workflows",
                framework: "generic",
                complexity: "Expert",
                stars: "36k+",
                setupCommands: {
                    postInstall: "pip install -e . && pip install -r requirements.txt && airflow db init && airflow users create --username admin --firstname Admin --lastname User --role Admin --email admin@example.com --password admin"
                }
            }
        ]
    },
    {
        category: "CMS & E-Commerce",
        repos: [
            {
                name: "Django Oscar",
                url: "https://github.com/django-oscar/django-oscar.git",
                description: "Domain-driven e-commerce for Django",
                framework: "django",
                complexity: "Advanced",
                stars: "6k+",
                setupCommands: {
                    postInstall: "pip install -e . && pip install -r requirements.txt"
                },
                dependencies: {
                    mode: 'pip',
                    files: ['requirements.txt'],
                    command: 'pip install -e . && pip install -r requirements.txt'
                }
            },
            {
                name: "Django CMS",
                url: "https://github.com/django-cms/django-cms.git",
                description: "Enterprise CMS built with Django",
                framework: "django",
                complexity: "Advanced",
                stars: "10k+",
                setupCommands: {
                    postInstall: "pip install -e . && pip install -r requirements.txt"
                },
                dependencies: {
                    mode: 'pip',
                    files: ['requirements.txt'],
                    command: 'pip install -e . && pip install -r requirements.txt'
                }
            },
            {
                name: "Wagtail Bakery",
                url: "https://github.com/moorinteractive/wagtail-bakery.git",
                description: "Static site generator for Wagtail",
                framework: "django",
                complexity: "Intermediate",
                stars: "180+",
                setupCommands: {
                    postInstall: "wagtail start myproject && cd myproject && pip install wagtail-bakery"
                }
            }
        ]
    },
    {
        category: "AI & Agents",
        repos: [
            {
                name: "Strands Agents SDK",
                url: "https://github.com/strands-agents/sdk-python.git",
                description: "Model-Driven AI Agent Framework",
                framework: "generic",
                complexity: "Advanced",
                stars: "New",
                setupCommands: {
                    postInstall: "pip install strands-agents strands-agents-tools"
                }
            },
            {
                name: "Pydantic AI",
                url: "https://github.com/pydantic/pydantic-ai.git",
                description: "GenAI Agent Framework",
                framework: "generic",
                complexity: "Intermediate",
                stars: "New",
                setupCommands: {
                    postInstall: "pip install pydantic-ai"
                }
            },
            {
                name: "Instructor",
                url: "https://github.com/567-labs/instructor.git",
                description: "Structured JSON Output for LLMs",
                framework: "generic",
                complexity: "Intermediate",
                stars: "5k+",
                setupCommands: {
                    postInstall: "pip install instructor"
                }
            },
            {
                name: "ScrapeGraph-AI",
                url: "https://github.com/ScrapeGraphAI/Scrapegraph-ai.git",
                description: "AI-Powered Web Scraping",
                framework: "generic",
                complexity: "Advanced",
                stars: "8k+",
                setupCommands: {
                    postInstall: "pip install scrapegraphai && playwright install"
                }
            },
            {
                name: "smolagents",
                url: "https://github.com/huggingface/smolagents.git",
                description: "Agents that Think in Code",
                framework: "generic",
                complexity: "Intermediate",
                stars: "4k+",
                setupCommands: {
                    postInstall: "pip install \"smolagents[toolkit]\""
                }
            },
            {
                name: "smolagents MCP",
                url: "https://github.com/huggingface/smolagents-mcp.git",
                description: "Model Context Protocol Integration for smolagents",
                framework: "generic",
                complexity: "Advanced",
                stars: "New",
                setupCommands: {
                    postInstall: "pip install \"smolagents[mcp]\""
                }
            }
        ]
    },
    {
        category: "Modern Web Frameworks",
        repos: [
            {
                name: "LiteStar",
                url: "https://github.com/litestar-org/litestar.git",
                description: "Production-Ready ASGI API Framework",
                framework: "fastapi",
                complexity: "Intermediate",
                stars: "3k+",
                setupCommands: {
                    postInstall: "pip install 'litestar[standard]'"
                }
            },
            {
                name: "FastRTC",
                url: "https://github.com/gradio-app/fastrtc.git",
                description: "Real-Time Communication from Python",
                framework: "generic",
                complexity: "Intermediate",
                stars: "1k+",
                setupCommands: {
                    postInstall: "pip install \"fastrtc[vad, tts]\""
                }
            },
            {
                name: "smallpond",
                url: "https://github.com/deepseek-ai/smallpond.git",
                description: "Lightweight Data Processing Framework",
                framework: "generic",
                complexity: "Advanced",
                stars: "New",
                setupCommands: {
                    postInstall: "pip install smallpond"
                }
            },
            {
                name: "Falcon",
                url: "https://github.com/falconry/falcon.git",
                description: "High-Performance REST API Framework",
                framework: "generic",
                complexity: "Intermediate",
                stars: "9k+",
                setupCommands: {
                    postInstall: "pip install uvicorn[standard] && pip install falcon"
                }
            }
        ]
    },
    {
        category: "Tools & Utilities",
        repos: [
            {
                name: "Click",
                url: "https://github.com/pallets/click.git",
                description: "Command Line Interface Toolkit",
                framework: "generic",
                complexity: "Beginner",
                stars: "14k+",
                setupCommands: {
                    postInstall: "pip install click"
                }
            },
            {
                name: "IceCream",
                url: "https://github.com/gruns/icecream.git",
                description: "Enhanced Print Debugging",
                framework: "generic",
                complexity: "Beginner",
                stars: "8k+",
                setupCommands: {
                    postInstall: "pip install icecream"
                },
                features: {
                    hasDb: false,
                    hasDemo: false
                }
            },
            {
                name: "Pokete",
                url: "https://github.com/lxgr-linux/pokete.git",
                description: "Terminal-Based Pokemon Game",
                framework: "generic",
                complexity: "Intermediate",
                stars: "1k+",
                setupCommands: {
                    postInstall: "pip install pokete"
                }
            },
            {
                name: "Gaphor",
                url: "https://github.com/gaphor/gaphor.git",
                description: "UML/SysML Modeling Tool",
                framework: "generic",
                complexity: "Advanced",
                stars: "2k+",
                setupCommands: {
                    postInstall: "pip install gaphor"
                }
            },
            {
                name: "Docling",
                url: "https://github.com/reliableengineer0308/docling.git",
                description: "Document Parsing & Analysis",
                framework: "generic",
                complexity: "Intermediate",
                stars: "New",
                setupCommands: {
                    postInstall: "pip install docling"
                }
            },
            {
                name: "MarkItDown",
                url: "https://github.com/reliableengineer0308/markitdown.git",
                description: "Convert files to Markdown (Microsoft Fork)",
                framework: "generic",
                complexity: "Intermediate",
                stars: "New",
                setupCommands: {
                    postInstall: "pip install ."
                }
            },
            {
                name: "commit (AI Commit Message Generator)",
                url: "https://github.com/guilatrova/commit.git",
                description: "AI commit message generator",
                framework: "generic",
                complexity: "Beginner",
                stars: "1k+",
                setupCommands: {
                    postInstall: "pip install commit"
                }
            },
            {
                name: "fix (Test Fixtures Management)",
                url: "https://pypi.org/project/fix/",
                description: "Test fixtures management",
                framework: "generic",
                complexity: "Intermediate",
                stars: "N/A",
                setupCommands: {
                    postInstall: "pip install fix"
                }
            }
        ]
    }
];
