-- PostgreSQL database

CREATE DATABASE foodfy WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'pt_BR.UTF-8' LC_CTYPE = 'pt_BR.UTF-8';

ALTER DATABASE foodfy OWNER TO postgres;

CREATE TABLE public.chefs (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    file_id integer
);

ALTER TABLE public.chefs OWNER TO postgres;

CREATE SEQUENCE public.chefs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.chefs_id_seq OWNER TO postgres;

ALTER SEQUENCE public.chefs_id_seq OWNED BY public.chefs.id;

CREATE TABLE public.files (
    id integer NOT NULL,
    name text,
    path text NOT NULL
);

ALTER TABLE public.files OWNER TO postgres;

CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.files_id_seq OWNER TO postgres;

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;

CREATE TABLE public.recipe_files (
    id integer NOT NULL,
    recipe_id integer,
    file_id integer
);


ALTER TABLE public.recipe_files OWNER TO postgres;

CREATE SEQUENCE public.recipe_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recipe_files_id_seq OWNER TO postgres;

ALTER SEQUENCE public.recipe_files_id_seq OWNED BY public.recipe_files.id;

CREATE TABLE public.recipes (
    id integer NOT NULL,
    chef_id integer NOT NULL,
    title text NOT NULL,
    ingredients text[],
    preparation text[],
    information text,
    created_at timestamp without time zone NOT NULL
);

ALTER TABLE public.recipes OWNER TO postgres;

CREATE SEQUENCE public.recipes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recipes_id_seq OWNER TO postgres;

ALTER SEQUENCE public.recipes_id_seq OWNED BY public.recipes.id;

ALTER TABLE ONLY public.chefs ALTER COLUMN id SET DEFAULT nextval('public.chefs_id_seq'::regclass);

ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);

ALTER TABLE ONLY public.recipe_files ALTER COLUMN id SET DEFAULT nextval('public.recipe_files_id_seq'::regclass);

ALTER TABLE ONLY public.recipes ALTER COLUMN id SET DEFAULT nextval('public.recipes_id_seq'::regclass);

ALTER TABLE ONLY public.chefs
    ADD CONSTRAINT chefs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.recipe_files
    ADD CONSTRAINT recipe_files_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.recipe_files
    ADD CONSTRAINT recipe_files_file_id_fkey FOREIGN KEY (file_id) REFERENCES public.files(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.recipe_files
    ADD CONSTRAINT recipe_files_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id);

REVOKE ALL ON TABLE public.recipe_files FROM postgres;
GRANT ALL ON TABLE public.recipe_files TO postgres WITH GRANT OPTION;