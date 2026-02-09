module.exports = grammar({
  name: "haproxy",

  extras: ($) => [/[ \t]/, $.comment],

  rules: {
    source_file: ($) => repeat($._item),

    _item: ($) => choice($.section, $.blank_line),

    blank_line: ($) => /\n/,

    section: ($) =>
      choice(
        $.global_section,
        $.defaults_section,
        $.frontend_section,
        $.backend_section,
        $.listen_section,
        $.resolvers_section,
        $.userlist_section,
        $.peers_section,
        $.mailers_section,
        $.cache_section,
        $.program_section,
        $.ring_section,
      ),

    // SECTION DEFINITIONS
    global_section: ($) =>
      seq(
        "global",
        "\n",
        repeat(seq(optional(/[ \t]+/), $._global_directive, "\n")),
      ),

    defaults_section: ($) =>
      seq(
        "defaults",
        optional(seq(/[ \t]+/, $.section_name)),
        "\n",
        repeat(seq(optional(/[ \t]+/), $._proxy_directive, "\n")),
      ),

    frontend_section: ($) =>
      seq(
        "frontend",
        /[ \t]+/,
        $.section_name,
        "\n",
        repeat(seq(optional(/[ \t]+/), $._frontend_directive, "\n")),
      ),

    backend_section: ($) =>
      seq(
        "backend",
        /[ \t]+/,
        $.section_name,
        "\n",
        repeat(seq(optional(/[ \t]+/), $._backend_directive, "\n")),
      ),

    listen_section: ($) =>
      seq(
        "listen",
        /[ \t]+/,
        $.section_name,
        optional(seq(/[ \t]+/, $.bind_address)),
        "\n",
        repeat(seq(optional(/[ \t]+/), $._listen_directive, "\n")),
      ),

    resolvers_section: ($) =>
      seq(
        "resolvers",
        /[ \t]+/,
        $.section_name,
        "\n",
        repeat(seq(optional(/[ \t]+/), $._resolvers_directive, "\n")),
      ),

    userlist_section: ($) =>
      seq(
        "userlist",
        /[ \t]+/,
        $.section_name,
        "\n",
        repeat(seq(optional(/[ \t]+/), $._userlist_directive, "\n")),
      ),

    peers_section: ($) =>
      seq(
        "peers",
        /[ \t]+/,
        $.section_name,
        "\n",
        repeat(seq(optional(/[ \t]+/), $._peers_directive, "\n")),
      ),

    mailers_section: ($) =>
      seq(
        "mailers",
        /[ \t]+/,
        $.section_name,
        "\n",
        repeat(seq(optional(/[ \t]+/), $._mailers_directive, "\n")),
      ),

    cache_section: ($) =>
      seq(
        "cache",
        /[ \t]+/,
        $.section_name,
        "\n",
        repeat(seq(optional(/[ \t]+/), $._cache_directive, "\n")),
      ),

    program_section: ($) =>
      seq(
        "program",
        /[ \t]+/,
        $.section_name,
        "\n",
        repeat(seq(optional(/[ \t]+/), $._program_directive, "\n")),
      ),

    ring_section: ($) =>
      seq(
        "ring",
        /[ \t]+/,
        $.section_name,
        "\n",
        repeat(seq(optional(/[ \t]+/), $._ring_directive, "\n")),
      ),

    // DIRECTIVE CATEGORIES
    _global_directive: ($) =>
      choice(
        $.log_directive,
        $.maxconn_directive,
        $.nbproc_directive,
        $.nbthread_directive,
        $.cpu_map_directive,
        $.ssl_default_directive,
        $.tune_directive,
        $.stats_directive,
        $.daemon_directive,
        $.ca_base_directive,
        $.chroot_directive,
        $.crt_base_directive,
        $.description_directive,
        $.node_directive,
        $.pidfile_directive,
        $.uid_directive,
        $.gid_directive,
        $.user_directive,
        $.group_directive,
        $.generic_directive,
      ),

    _proxy_directive: ($) =>
      choice(
        $.mode_directive,
        $.timeout_directive,
        $.option_directive,
        $.no_option_directive,
        $.maxconn_directive,
        $.retries_directive,
        $.hash_type_directive,
        $.errorfile_directive,
        $.generic_directive,
      ),

    _frontend_directive: ($) =>
      choice(
        $.bind_directive,
        $.acl_directive,
        $.use_backend_directive,
        $.default_backend_directive,
        $.http_request_directive,
        $.http_response_directive,
        $.tcp_request_directive,
        $.redirect_directive,
        $.capture_directive,
        $._proxy_directive,
        $.use_server_directive,
      ),

    _backend_directive: ($) =>
      choice(
        $.server_directive,
        $.balance_directive,
        $.stick_directive,
        $.cookie_directive,
        $.http_check_directive,
        $.tcp_check_directive,
        $.mode_directive,
        $.timeout_directive,
        $.option_directive,
        $.no_option_directive,
        $.maxconn_directive,
        $.retries_directive,
        $.hash_type_directive,
        $.errorfile_directive,
        $.generic_directive,
      ),

    _listen_directive: ($) =>
      choice(
        $.bind_directive,
        $.server_directive,
        $.balance_directive,
        $.mode_directive,
        $.timeout_directive,
        $.option_directive,
        $.no_option_directive,
        $.maxconn_directive,
        $.retries_directive,
        $.hash_type_directive,
        $.errorfile_directive,
        $.generic_directive,
        $.use_server_directive,
      ),
    _resolvers_directive: ($) =>
      choice(
        $.nameserver_directive,
        $.resolve_retries_directive,
        $.timeout_directive,
        $.generic_directive,
      ),

    _userlist_directive: ($) =>
      choice($.user_directive, $.group_directive, $.generic_directive),

    _peers_directive: ($) => choice($.peer_directive, $.generic_directive),

    _mailers_directive: ($) =>
      choice($.mailer_directive, $.timeout_directive, $.generic_directive),

    _cache_directive: ($) =>
      choice(
        $.total_max_size_directive,
        $.max_age_directive,
        $.max_object_size_directive,
        $.generic_directive,
      ),

    _program_directive: ($) => choice($.command_directive, $.generic_directive),

    _ring_directive: ($) =>
      choice(
        $.format_directive,
        $.maxlen_directive,
        $.size_directive,
        $.generic_directive,
      ),

    // SPECIFIC DIRECTIVES
    bind_directive: ($) =>
      seq("bind", /[ \t]+/, $.bind_address, optional($.bind_options)),
    server_directive: ($) =>
      seq(
        "server",
        /[ \t]+/,
        $.server_name,
        /[ \t]+/,
        $.server_address,
        optional($.server_options),
      ),
    acl_directive: ($) =>
      seq("acl", /[ \t]+/, $.acl_name, /[ \t]+/, $.acl_criterion),
    use_backend_directive: ($) =>
      seq(
        "use_backend",
        /[ \t]+/,
        $.backend_ref,
        /[ \t]+/,
        optional($.condition),
      ),
    use_server_directive: ($) =>
      seq(
        "use-server",
        /[ \t]+/,
        $.server_name,
        /[ \t]+/,
        optional($.condition),
      ),
    default_backend_directive: ($) =>
      seq("default_backend", /[ \t]+/, $.backend_ref),
    mode_directive: ($) => seq("mode", /[ \t]+/, $.mode_type),
    balance_directive: ($) =>
      seq(
        "balance",
        /[ \t]+/,
        $.balance_algorithm,
        optional($.balance_options),
      ),
    timeout_directive: ($) =>
      seq("timeout", /[ \t]+/, $.timeout_type, /[ \t]+/, $.time_value),
    option_directive: ($) =>
      seq("option", /[ \t]+/, $.option_name, optional($.option_args)),
    no_option_directive: ($) =>
      seq("no", /[ \t]+/, "option", /[ \t]+/, $.option_name),
    log_directive: ($) =>
      seq(
        "log",
        /[ \t]+/,
        $.log_target,
        optional(seq(/[ \t]+/, $.log_level)),
        optional($.log_options),
      ),
    maxconn_directive: ($) => seq("maxconn", /[ \t]+/, $.number),
    nbproc_directive: ($) => seq("nbproc", /[ \t]+/, $.number),
    nbthread_directive: ($) => seq("nbthread", /[ \t]+/, $.number),
    cpu_map_directive: ($) => seq("cpu-map", /[ \t]+/, $.cpu_map_args),
    ssl_default_directive: ($) =>
      seq(/ssl-default-[a-z-]+/, /[ \t]+/, $.ssl_options),
    tune_directive: ($) =>
      seq("tune", ".", $.tune_option, /[ \t]+/, $.tune_value),
    stats_directive: ($) => seq("stats", /[ \t]+/, $.stats_option),
    daemon_directive: ($) => "daemon",
    ca_base_directive: ($) => seq("ca-base", /[ \t]+/, $.path),
    chroot_directive: ($) => seq("chroot", /[ \t]+/, $.path),
    crt_base_directive: ($) => seq("crt-base", /[ \t]+/, $.path),
    description_directive: ($) => seq("description", /[ \t]+/, $.string),
    node_directive: ($) => seq("node", /[ \t]+/, $.identifier),
    pidfile_directive: ($) => seq("pidfile", /[ \t]+/, $.path),
    uid_directive: ($) => seq("uid", /[ \t]+/, $.number),
    gid_directive: ($) => seq("gid", /[ \t]+/, $.number),
    user_directive: ($) =>
      seq("user", /[ \t]+/, $.identifier, optional($.user_options)),
    group_directive: ($) =>
      seq("group", /[ \t]+/, $.identifier, optional($.group_options)),
    retries_directive: ($) => seq("retries", /[ \t]+/, $.number),
    hash_type_directive: ($) => seq("hash-type", /[ \t]+/, $.hash_algorithm),
    errorfile_directive: ($) =>
      seq("errorfile", /[ \t]+/, $.http_status, /[ \t]+/, $.path),
    http_request_directive: ($) => seq("http-request", /[ \t]+/, $.http_action),
    http_response_directive: ($) =>
      seq("http-response", /[ \t]+/, $.http_action),
    tcp_request_directive: ($) =>
      seq("tcp-request", /[ \t]+/, $.tcp_type, /[ \t]+/, $.tcp_action),
    redirect_directive: ($) => seq("redirect", /[ \t]+/, $.redirect_rule),
    capture_directive: ($) =>
      seq("capture", /[ \t]+/, $.capture_type, /[ \t]+/, $.capture_args),
    stick_directive: ($) => seq("stick", /[ \t]+/, $.stick_rule),
    cookie_directive: ($) =>
      seq("cookie", /[ \t]+/, $.cookie_name, optional($.cookie_options)),
    http_check_directive: ($) => seq("http-check", /[ \t]+/, $.check_action),
    tcp_check_directive: ($) => seq("tcp-check", /[ \t]+/, $.check_action),
    nameserver_directive: ($) =>
      seq("nameserver", /[ \t]+/, $.identifier, /[ \t]+/, $.address),
    resolve_retries_directive: ($) =>
      seq("resolve_retries", /[ \t]+/, $.number),
    peer_directive: ($) =>
      seq("peer", /[ \t]+/, $.identifier, /[ \t]+/, $.address),
    mailer_directive: ($) =>
      seq("mailer", /[ \t]+/, $.identifier, /[ \t]+/, $.address),
    total_max_size_directive: ($) => seq("total-max-size", /[ \t]+/, $.size),
    max_age_directive: ($) => seq("max-age", /[ \t]+/, $.number),
    max_object_size_directive: ($) => seq("max-object-size", /[ \t]+/, $.size),
    command_directive: ($) => seq("command", /[ \t]+/, $.command_line),
    format_directive: ($) => seq("format", /[ \t]+/, $.format_type),
    maxlen_directive: ($) => seq("maxlen", /[ \t]+/, $.number),
    size_directive: ($) => seq("size", /[ \t]+/, $.size),

    generic_directive: ($) => seq($.directive_name, optional($.directive_args)),

    // COMPONENTS
    section_name: ($) => /[a-zA-Z0-9_.-]+/,
    directive_name: ($) => /[a-zA-Z0-9_.-]+/,
    directive_args: ($) => /.+/,

    bind_address: ($) => /[0-9a-zA-Z.:*\[\]-]+/,
    bind_options: ($) => /.+/,

    server_name: ($) => /[a-zA-Z0-9_.-]+/,
    server_address: ($) => /[0-9a-zA-Z.:*\[\]-]+/,
    server_options: ($) => /.+/,

    acl_name: ($) => /[a-zA-Z0-9_.-]+/,
    acl_criterion: ($) => /.+/,

    backend_ref: ($) => /[a-zA-Z0-9_.-]+/,
    condition: ($) => seq(choice("if", "unless"), /[ \t]+/, $.condition_expr),
    condition_expr: ($) => /.+/,

    mode_type: ($) => choice("http", "tcp", "health"),

    balance_algorithm: ($) =>
      choice(
        "roundrobin",
        "static-rr",
        "leastconn",
        "first",
        "source",
        "uri",
        "url_param",
        "hdr",
        "random",
        "rdp-cookie",
      ),
    balance_options: ($) => /.+/,

    timeout_type: ($) =>
      choice(
        "client",
        "client-fin",
        "connect",
        "server",
        "server-fin",
        "tunnel",
        "http-request",
        "http-keep-alive",
        "queue",
        "tarpit",
        "check",
      ),
    time_value: ($) => /\d+[smhd]?/,

    option_name: ($) => /[a-zA-Z0-9-]+/,
    option_args: ($) => /.+/,

    log_target: ($) => /[0-9a-zA-Z.:/@-]+/,
    log_level: ($) =>
      choice(
        "emerg",
        "alert",
        "crit",
        "err",
        "warning",
        "notice",
        "info",
        "debug",
      ),
    log_options: ($) => /.+/,

    number: ($) => /\d+/,
    size: ($) => /\d+[kKmMgG]?/,
    path: ($) => /[^\s]+/,
    string: ($) =>
      choice(seq('"', /[^"]*/, '"'), seq("'", /[^']*/, "'"), /[^\s]+/),
    identifier: ($) => /[a-zA-Z0-9_.-]+/,
    address: ($) => /[0-9a-zA-Z.:/@-]+/,
    http_status: ($) => /\d{3}/,

    cpu_map_args: ($) => /.+/,
    ssl_options: ($) => /.+/,
    tune_option: ($) => /[a-zA-Z0-9.-]+/,
    tune_value: ($) => /.+/,
    stats_option: ($) => /.+/,
    user_options: ($) => /.+/,
    group_options: ($) => /.+/,
    hash_algorithm: ($) => /.+/,
    http_action: ($) => /.+/,
    tcp_type: ($) => choice("connection", "content", "session"),
    tcp_action: ($) => /.+/,
    redirect_rule: ($) => /.+/,
    capture_type: ($) => choice("request", "response", "cookie"),
    capture_args: ($) => /.+/,
    stick_rule: ($) => /.+/,
    cookie_name: ($) => /[a-zA-Z0-9_.-]+/,
    cookie_options: ($) => /.+/,
    check_action: ($) => /.+/,
    command_line: ($) => /.+/,
    format_type: ($) => /.+/,

    comment: ($) => token(seq("#", /.*/)),
  },
});
