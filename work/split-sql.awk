function flush_stmt(   i) {
  if (stmt_lines == 0) return;

  if (chunk_lines > 0 && chunk_lines + stmt_lines > max_lines) {
    close(out);
    part++;
    chunk_lines = 0;
    out = sprintf("%s/%s_part_%02d.sql", dir, base, part);
  }

  for (i = 1; i <= stmt_lines; i++) print stmt[i] >> out;
  print "" >> out;
  chunk_lines += stmt_lines + 1;
  delete stmt;
  stmt_lines = 0;
}

BEGIN {
  max_lines = 90;
  part = 0;
  chunk_lines = 0;
  in_dollar = 0;
  out = sprintf("%s/%s_part_%02d.sql", dir, base, part);
}

{
  stmt[++stmt_lines] = $0;
  if ($0 ~ /\$\$/) in_dollar = !in_dollar;
  if (!in_dollar && $0 ~ /;[[:space:]]*$/) flush_stmt();
}

END {
  flush_stmt();
  close(out);
}
